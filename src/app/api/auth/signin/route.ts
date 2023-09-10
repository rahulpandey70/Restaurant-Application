import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import validator from "validator";
import bcrypt from "bcrypt";
import * as jose from "jose";

interface FormData {
	email: string;
	password: string;
}

const prisma = new PrismaClient();

export async function GET() {
	return NextResponse.json({ message: "Hello, World" });
}

export async function POST(req: Request) {
	const response: FormData = await req.json();
	const errors: string[] = [];

	const validateSchema = [
		{
			valid: validator.isEmail(response.email),
			errorMessage: "Email is invalid!",
		},
		{
			valid: validator.isLength(response.password, {
				min: 5,
			}),
			errorMessage: "Password is invalid!",
		},
	];

	validateSchema.forEach((check) => {
		if (!check.valid) {
			errors.push(check.errorMessage);
		}
	});

	if (errors.length) {
		return new NextResponse(JSON.stringify({ errorMessage: errors[0] }), {
			status: 400,
		});
	}

	const filteredUser = await prisma.user.findUnique({
		where: {
			email: response.email,
		},
	});

	if (!filteredUser) {
		return new NextResponse(
			JSON.stringify({ errorMessage: "No account found! Please Signup First" }),
			{
				status: 400,
			}
		);
	}

	const isMatch = await bcrypt.compare(
		response.password,
		filteredUser.password
	);

	if (!isMatch) {
		return new NextResponse(
			JSON.stringify({ errorMessage: "Password is incorrect" }),
			{
				status: 400,
			}
		);
	}

	const alg = "HS256";
	const signature = new TextEncoder().encode(process.env.JWT_SECRET);

	const token = await new jose.SignJWT({
		email: response.email,
	})
		.setProtectedHeader({ alg })
		.setExpirationTime("24h")
		.sign(signature);

	const res = NextResponse.json(
		{
			id: filteredUser.id,
			firstName: filteredUser.first_name,
			lastName: filteredUser.last_name,
			email: filteredUser.email,
			city: filteredUser.city,
			phone: filteredUser.phone,
		},
		{ status: 200 }
	);
	res.cookies.set({
		name: "jwt",
		value: token,
		maxAge: 60 * 60 * 24,
	});

	return res;
}
