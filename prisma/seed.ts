import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Project status constants (SQLite doesn't support enums)
const ProjectStatus = {
  PLANNING: "PLANNING",
  IN_PROGRESS: "IN_PROGRESS",
  REVIEW: "REVIEW",
  HANDOVER: "HANDOVER"
} as const;

async function main() {
  console.log("Seeding database...");

  // Create a team
  const team = await prisma.team.upsert({
    where: { id: "team-1" },
    update: {},
    create: {
      id: "team-1",
      name: "Learning & Development"
    }
  });

  console.log(`Created team: ${team.name}`);

  // Create designer capacities
  const designers = [
    { name: "Alice Chen", hours: 40 },
    { name: "Bob Martinez", hours: 32 },
    { name: "Carol Williams", hours: 40 },
    { name: "David Kim", hours: 24 },
    { name: "Emma Thompson", hours: 40 }
  ];

  for (const designer of designers) {
    await prisma.designerCapacity.upsert({
      where: {
        teamId_designerName: {
          teamId: team.id,
          designerName: designer.name
        }
      },
      update: { weeklyAvailableHours: designer.hours },
      create: {
        teamId: team.id,
        designerName: designer.name,
        weeklyAvailableHours: designer.hours
      }
    });
  }

  console.log(`Created ${designers.length} designer capacities`);

  // Create projects with various statuses and risk levels
  const today = new Date();
  const addDays = (days: number) => {
    const date = new Date(today);
    date.setDate(date.getDate() + days);
    return date;
  };

  const projects = [
    {
      id: "proj-1",
      title: "New Hire Onboarding Revamp",
      client: "HR Department",
      instructionalDesigner: "Alice Chen",
      status: ProjectStatus.IN_PROGRESS,
      dueDate: addDays(5),
      estimatedScopedHours: 60,
      hoursWorked: 45,
      notes: "Major update to onboarding program. Need to finalize video scripts and review assessment questions. Stakeholder feedback pending on Module 3."
    },
    {
      id: "proj-2",
      title: "Sales Enablement Course",
      client: "Sales Team",
      instructionalDesigner: "Alice Chen",
      status: ProjectStatus.REVIEW,
      dueDate: addDays(10),
      estimatedScopedHours: 40,
      hoursWorked: 38,
      notes: "Final review with sales leadership scheduled for Friday."
    },
    {
      id: "proj-3",
      title: "Compliance Training 2024",
      client: "Legal",
      instructionalDesigner: "Bob Martinez",
      status: ProjectStatus.IN_PROGRESS,
      dueDate: addDays(3),
      estimatedScopedHours: 30,
      hoursWorked: 35,
      notes: "Over budget due to additional regulatory requirements. Need to discuss scope with Legal team."
    },
    {
      id: "proj-4",
      title: "Leadership Development Program",
      client: "Executive Team",
      instructionalDesigner: "Carol Williams",
      status: ProjectStatus.PLANNING,
      dueDate: addDays(21),
      estimatedScopedHours: 80,
      hoursWorked: 10,
      notes: "Kickoff meeting completed. Gathering requirements from department heads."
    },
    {
      id: "proj-5",
      title: "Customer Service Excellence",
      client: "Support Team",
      instructionalDesigner: "Carol Williams",
      status: ProjectStatus.IN_PROGRESS,
      dueDate: addDays(7),
      estimatedScopedHours: 45,
      hoursWorked: 30,
      notes: "Good progress. Interactive scenarios in development."
    },
    {
      id: "proj-6",
      title: "Product Knowledge Base",
      client: "Product Team",
      instructionalDesigner: "David Kim",
      status: ProjectStatus.IN_PROGRESS,
      dueDate: addDays(4),
      estimatedScopedHours: 25,
      hoursWorked: 8,
      notes: "At risk - started late due to delayed requirements. Need to prioritize this week."
    },
    {
      id: "proj-7",
      title: "Safety Procedures Update",
      client: "Operations",
      instructionalDesigner: "Emma Thompson",
      status: ProjectStatus.HANDOVER,
      dueDate: addDays(-2),
      estimatedScopedHours: 20,
      hoursWorked: 18,
      notes: "Successfully completed and handed over to Operations team."
    },
    {
      id: "proj-8",
      title: "Technical Writing Workshop",
      client: "Engineering",
      instructionalDesigner: "Emma Thompson",
      status: ProjectStatus.IN_PROGRESS,
      dueDate: addDays(14),
      estimatedScopedHours: 35,
      hoursWorked: 15,
      notes: "On track. First draft of workshop materials complete."
    },
    {
      id: "proj-9",
      title: "Diversity & Inclusion Training",
      client: "HR Department",
      instructionalDesigner: "Bob Martinez",
      status: ProjectStatus.PLANNING,
      dueDate: addDays(30),
      estimatedScopedHours: 50,
      hoursWorked: 5,
      notes: "Initial research phase. Consulting with external D&I experts."
    },
    {
      id: "proj-10",
      title: "Remote Work Best Practices",
      client: "IT Department",
      instructionalDesigner: "David Kim",
      status: ProjectStatus.REVIEW,
      dueDate: addDays(2),
      estimatedScopedHours: 15,
      hoursWorked: 14,
      notes: "Final review in progress. Minor edits needed."
    }
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { id: project.id },
      update: {
        title: project.title,
        client: project.client,
        instructionalDesigner: project.instructionalDesigner,
        status: project.status,
        dueDate: project.dueDate,
        estimatedScopedHours: project.estimatedScopedHours,
        hoursWorked: project.hoursWorked,
        notes: project.notes
      },
      create: {
        id: project.id,
        teamId: team.id,
        title: project.title,
        client: project.client,
        instructionalDesigner: project.instructionalDesigner,
        status: project.status,
        dueDate: project.dueDate,
        estimatedScopedHours: project.estimatedScopedHours,
        hoursWorked: project.hoursWorked,
        notes: project.notes,
        createdBy: "seed-script"
      }
    });
  }

  console.log(`Created ${projects.length} projects`);

  // Add some tasks to a few projects
  const tasks = [
    { projectId: "proj-1", name: "Write video scripts for Module 1", completed: true },
    { projectId: "proj-1", name: "Write video scripts for Module 2", completed: true },
    { projectId: "proj-1", name: "Write video scripts for Module 3", completed: false },
    { projectId: "proj-1", name: "Create assessment questions", completed: false },
    { projectId: "proj-1", name: "Review with HR stakeholders", completed: false },
    { projectId: "proj-3", name: "Update compliance scenarios", completed: true },
    { projectId: "proj-3", name: "Add new regulatory content", completed: true },
    { projectId: "proj-3", name: "Final legal review", completed: false },
    { projectId: "proj-5", name: "Design interactive scenarios", completed: false },
    { projectId: "proj-5", name: "Record customer service examples", completed: true },
    { projectId: "proj-6", name: "Gather product documentation", completed: true },
    { projectId: "proj-6", name: "Create knowledge base structure", completed: false },
    { projectId: "proj-6", name: "Write product guides", completed: false }
  ];

  // Delete existing tasks and recreate
  await prisma.task.deleteMany({
    where: {
      projectId: { in: ["proj-1", "proj-3", "proj-5", "proj-6"] }
    }
  });

  for (const task of tasks) {
    await prisma.task.create({
      data: {
        projectId: task.projectId,
        name: task.name,
        completed: task.completed
      }
    });
  }

  console.log(`Created ${tasks.length} tasks`);

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
