import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import validator from "validator";
import * as jose from "jose";

export async function GET() {
	return NextResponse.json({ message: "Hello, World" });
}

interface formData {
	firstName: string;
	lastName: string;
	email: string;
	city: string;
	phone: number;
	password: string;
}

const prisma = new PrismaClient();

export async function POST(req: Request) {
	const response: formData = await req.json();
	const errors: string[] = [];

	const validationSchema = [
		{
			valid: validator.isLength(response.firstName, {
				min: 1,
			}),
			errorMessage: "First name is invalid!",
		},
		{
			valid: validator.isLength(response.lastName, {
				min: 1,
			}),
			errorMessage: "Last name is invalid!",
		},
		{
			valid: validator.isLength(response.city, {
				min: 1,
			}),
			errorMessage: "City is invalid!",
		},
		{
			valid: validator.isEmail(response.email),
			errorMessage: "Email is invalid!",
		},
		{
			valid: validator.isMobilePhone(String(response.phone)),
			errorMessage: "Phone number is invalid!",
		},
		{
			valid: validator.isLength(response.password, {
				min: 5,
			}),
			errorMessage: "Password is invalid!",
		},
	];

	validationSchema.forEach((check) => {
		if (!check.valid) {
			errors.push(check.errorMessage);
		}
	});

	if (errors.length) {
		return NextResponse.json({ errorMessage: errors[0] });
	}

	const userWithEmail = await prisma.user.findUnique({
		where: {
			email: response.email,
		},
	});

	if (userWithEmail) {
		return NextResponse.json({ errorMessage: "Email address already exists" });
	}

	const hashedPassword = await bcrypt.hash(response.password, 10);

	const user = await prisma.user.create({
		data: {
			first_name: response.firstName,
			last_name: response.lastName,
			email: response.email,
			city: response.city,
			phone: String(response.phone),
			password: hashedPassword,
		},
	});

	const alg = "HS256";
	const signature = new TextEncoder().encode(process.env.JWT_SECRET);

	const token = await new jose.SignJWT({
		email: response.email,
	})
		.setProtectedHeader({ alg })
		.setExpirationTime("24h")
		.sign(signature);

	return NextResponse.json({ response: user, token });
}