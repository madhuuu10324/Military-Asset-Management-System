"use client";

import { useAuth } from "@/contexts/AuthContext";

/**
 * A component that renders its children only if the current user's role
 * is included in the allowedRoles array.
 * @param {object} props
 * @param {React.ReactNode} props.children - The content to render if authorized.
 * @param {string[]} props.allowedRoles - An array of roles that are allowed to see the content.
 */
export default function RoleGuard({ children, allowedRoles }) {
    const { user } = useAuth();

    if (!user || !allowedRoles.includes(user.role)) {
        return null; // Don't render anything if the role doesn't match
    }

    return <>{children}</>;
}