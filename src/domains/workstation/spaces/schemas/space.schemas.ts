import { z } from "zod"

import { spaceRoles } from "@/domains/workstation/spaces/types/space.types"

export const createSpaceSchema = z.object({
  name: z.string().trim().min(2, "Name is required."),
  description: z.string().trim().min(6, "Description is required."),
  members: z.array(z.object({
    memberId: z.string().min(1),
    role: z.enum(spaceRoles),
  })).default([]),
})

export const addSpaceMemberSchema = z.object({
  memberId: z.string().min(1, "Select an active member."),
  role: z.enum(spaceRoles, { message: "Select a Space role." }),
})

export type CreateSpaceInput = z.infer<typeof createSpaceSchema>
export type AddSpaceMemberInput = z.infer<typeof addSpaceMemberSchema>
