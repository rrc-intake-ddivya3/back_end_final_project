import { getAuth } from "../src/config/firebaseAdmin";

type Role = "admin" | "staff" | "customer";

function isRole(value: string): value is Role {
    return value === "admin" || value === "staff" || value === "customer";
}

async function main(): Promise<void> {
    const [, , uid, roleArg] = process.argv;

    if (!uid || !roleArg) {
        throw new Error(
            "Usage: npx ts-node scripts/set-claims.ts <uid> <admin|staff|customer>",
        );
    }

    if (!isRole(roleArg)) {
        throw new Error("Role must be one of: admin, staff, customer");
    }

    await getAuth().setCustomUserClaims(uid, { role: roleArg });
    console.log(`Custom claim set successfully: uid=${uid}, role=${roleArg}`);
}

main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`Failed to set custom claim: ${message}`);
    process.exit(1);
});
