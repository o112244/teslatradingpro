/*
  # Add Password Reset Functionality

  1. New Tables
    - `password_reset_tokens`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `token` (text, unique)
      - `expires_at` (timestamptz)
      - `used` (boolean, default false)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `password_reset_tokens` table
    - Add policy for users to create reset tokens
    - Add policy for system to validate tokens
    
  3. Important Notes
    - Tokens expire after 1 hour
    - Tokens are single-use only
    - Old tokens are automatically invalidated when used
*/

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL DEFAULT now() + interval '1 hour',
  used boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create password reset tokens"
  ON password_reset_tokens
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can read valid tokens"
  ON password_reset_tokens
  FOR SELECT
  USING (NOT used AND expires_at > now());

CREATE POLICY "System can update tokens"
  ON password_reset_tokens
  FOR UPDATE
  USING (NOT used AND expires_at > now())
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);
