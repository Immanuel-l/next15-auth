"use server";

import bcrypt from "bcryptjs";

import * as z from "zod"

import { db } from "@/lib/db";
import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const ValidatedFields = RegisterSchema.safeParse(values);

    if (!ValidatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { email, password, name } = ValidatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        return { error: "Email already in use!" }
    }

    await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    const verifacationToken = await generateVerificationToken(email);
    await sendVerificationEmail(
        verifacationToken.email,
        verifacationToken.token,
    );

    return { success: "Confirmation email sent!" };
};

