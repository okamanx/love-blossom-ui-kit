-- Update profiles that don't have usernames to generate unique ones
UPDATE profiles 
SET username = CASE 
  WHEN username IS NULL OR username = '' THEN 
    'user_' || SUBSTRING(user_id::text, 1, 8)
  ELSE username 
END
WHERE username IS NULL OR username = '';

-- Ensure username column is unique (add constraint if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'profiles_username_unique' 
        AND table_name = 'profiles'
    ) THEN
        ALTER TABLE profiles ADD CONSTRAINT profiles_username_unique UNIQUE (username);
    END IF;
END $$;