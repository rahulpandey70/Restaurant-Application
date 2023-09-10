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
		return new NextResponse(JSON.stringify({ errorMessage: errors[0] }), {
			status: 400,
		});
	}

	const userWithEmail = await prisma.user.findUnique({
		where: {
			email: response.email,
		},
	});

	if (userWithEmail) {
		return new NextResponse(
			JSON.stringify({ errorMessage: "Email already exists." }),
			{
				status: 409,
			}
		);
	}

	const hashedPassword = await bcrypt.hash(response.password, 10);

	const newUser = await prisma.user.create({
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

	const res = NextResponse.json(
		{
			id: newUser.id,
			firstName: newUser.first_name,
			lastName: newUser.last_name,
			email: newUser.email,
			city: newUser.city,
			phone: newUser.phone,
		},
		{ status: 201 }
	);

	res.cookies.set({
		name: "jwt",
		value: token,
		maxAge: 60 * 60 * 24,
	});

	return res;
}
