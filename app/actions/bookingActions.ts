"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getBookingsAction() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: bookings };
  } catch (error) {
    console.error("Failed to get bookings:", error);
    return { success: false, error: "Failed to load bookings" };
  }
}

export async function createBookingAction(data: {
  name: string;
  phone: string;
  email: string | null;
  date: string;
  selectedPlot: string;
}) {
  try {
    const booking = await prisma.booking.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        date: data.date,
        selectedPlot: data.selectedPlot,
        status: "Pending",
      },
    });

    revalidatePath("/admin/bookings");
    return { success: true, data: booking };
  } catch (error) {
    console.error("Failed to create booking:", error);
    return { success: false, error: "Failed to submit booking request" };
  }
}

export async function updateBookingStatusAction(id: string, status: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/admin/bookings");
    return { success: true, data: booking };
  } catch (error) {
    console.error("Failed to update booking:", error);
    return { success: false, error: "Failed to update booking status" };
  }
}

export async function deleteBookingAction(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.booking.delete({
      where: { id },
    });

    revalidatePath("/admin/bookings");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete booking:", error);
    return { success: false, error: "Failed to delete booking" };
  }
}
