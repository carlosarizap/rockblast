import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';
import crypto from 'crypto';
import { Pool } from 'pg'; // Assuming you have a 'db' file for the database pool
import bcrypt from 'bcryptjs';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function PUT(req: Request) {
    const { token, email, newPassword } = await req.json();

    if (!token || !email || !newPassword) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
        // Verify the token and expiry
        const result = await client.query(
            'SELECT token, expiry FROM tb_reset_tokens WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
        }

        const { token: storedToken, expiry } = result.rows[0];
        if (storedToken !== token || expiry < Date.now()) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        await client.query(
            'UPDATE tb_usuario SET usu_pass = $1 WHERE usu_correo = $2',
            [hashedPassword, email]
        );

        // Delete the token after successful password reset
        await client.query('DELETE FROM tb_reset_tokens WHERE email = $1', [email]);

        return NextResponse.json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Error resetting password: ', error);
        return NextResponse.json({ error: 'Error resetting password' }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function POST(req: Request) {
    const { email } = await req.json();
  
    // Validate that the email was provided
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
  
    try {
      // Generate a token (can be used as a reset password token)
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = Date.now() + 3600000; // Token is valid for 1 hour
  
      // Store the token in the database
      const client = await pool.connect();
      try {
        await client.query(
          'INSERT INTO tb_reset_tokens (email, token, expiry) VALUES ($1, $2, $3) ON CONFLICT (email) DO UPDATE SET token = $2, expiry = $3',
          [email, resetToken, resetTokenExpiry]
        );
      } finally {
        client.release();
      }
  
      // Prepare the reset URL
      const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}&email=${email}`;
  
      // Send password reset email using SendGrid template
      const msg = {
        to: email,
        from: 'carlosariza7459@gmail.com', // Use your verified email
        subject: 'Restablecer tu contraseña',
        templateId: 'd-6fb6b5db10f74a9e83b583e28c08e8a2', // Replace with your SendGrid template ID
        dynamicTemplateData: {
          reset_url: resetUrl,
        },
      };
  
      await sgMail.send(msg);
  
      return NextResponse.json({ message: 'Correo de recuperación enviado' });
    } catch (error) {
      console.error('Error sending email: ', error);
      return NextResponse.json({ error: 'Error enviando el correo' }, { status: 500 });
    }
  }
