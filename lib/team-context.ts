import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

/**
 * Team context utilities for server-side team scoping
 *
 * For MVP without auth, we use cookies to track selected team.
 * In production, this would be replaced with session-based team context from auth.
 */

const TEAM_COOKIE_NAME = "selected-team-id";

/**
 * Get the current team ID from cookies or default to first team
 */
export async function getCurrentTeamId(): Promise<string> {
  const cookieStore = cookies();
  const teamIdFromCookie = cookieStore.get(TEAM_COOKIE_NAME)?.value;

  // If team ID in cookie, validate it exists
  if (teamIdFromCookie) {
    const team = await prisma.team.findUnique({
      where: { id: teamIdFromCookie }
    });
    if (team) {
      return team.id;
    }
  }

  // Otherwise, get or create default team
  let team = await prisma.team.findFirst();

  if (!team) {
    team = await prisma.team.create({
      data: { name: "Default Team" }
    });
  }

  return team.id;
}

/**
 * Get all teams (for team selection UI)
 */
export async function getAllTeams() {
  return prisma.team.findMany({
    orderBy: { name: "asc" }
  });
}

/**
 * Get current team with full details
 */
export async function getCurrentTeam() {
  const teamId = await getCurrentTeamId();
  return prisma.team.findUnique({
    where: { id: teamId }
  });
}
