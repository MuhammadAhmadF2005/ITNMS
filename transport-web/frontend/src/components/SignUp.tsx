
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) {
                throw error;
            }

            setSuccess(true);
            // Wait a bit or let them stay on the success screen
            // Or if auto-sign in enabled, they might be logged in.
            // But usually verify email is required. Supabase defaults to verify.
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-background px-4">
            <div className="w-full max-w-sm overflow-hidden rounded-lg border border-border bg-card shadow-lg">
                <div className="flex flex-col space-y-2 p-6 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">Create an account</h1>
                    <p className="text-sm text-muted-foreground">
                        Enter your details to get started
                    </p>
                </div>
                <div className="p-6 pt-0">
                    {success ? (
                        <div className="space-y-4 text-center">
                            <div className="rounded-md bg-green-500/15 p-3 text-sm text-green-600">
                                Registration successful! Check your email to confirm your account.
                            </div>
                            <Link to="/login" className="inline-block text-sm text-primary underline underline-offset-4">
                                Back to Login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSignUp} className="space-y-4">
                            {error && (
                                <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none text-foreground" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none text-foreground" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                            >
                                {loading ? 'Creating account...' : 'Sign Up'}
                            </button>
                        </form>
                    )}
                    {!success && (
                        <div className="mt-4 text-center text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Link to="/login" className="underline underline-offset-4 hover:text-primary">
                                Sign in
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
