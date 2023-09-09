import { NextResponse } from "next/server";
import { headers } from "next/headers";
import * as jose from "jose";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
	const headersInstance = headers();
	const BearerToken = headersInstance.get("authorization") as string;

	const token = BearerToken.split(" ")[1];
	const payload = jwt.decode(token) as { email: string };

	const singleUser = await prisma.user.findUnique({
		where: {
			email: payload.email,
		},
		select: {
			id: true,
			first_name: true,
			last_name: true,
			email: true,
			city: true,
			phone: true,
		},
	});

	return NextResponse.json({ message: singleUser });
}
