import { initialGroups } from '../mock/data';
import type { Group, GroupMember, Student } from '../types';

const delay = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

let groupsState: Group[] = [...initialGroups];

export const groupService = {
  async getGroups(): Promise<Group[]> {
    await delay(250);
    return [...groupsState];
  },

  async createGroup(student: Student, pickup: string, destination: string): Promise<Group> {
    await delay(400);

    const createdGroup: Group = {
      id: `G${String(groupsState.length + 1).padStart(3, '0')}`,
      pickup,
      destination,
      members: [
        {
          id: `m-${Date.now()}`,
          studentId: student.id,
          name: student.name,
        },
      ],
      status: 'WAITING',
      createdAt: new Date().toISOString(),
      totalSeats: 4,
    };

    groupsState = [createdGroup, ...groupsState];
    return createdGroup;
  },

  async joinGroup(student: Student, groupId: string): Promise<Group> {
    await delay(500);

    const currentGroup = groupsState.find((group) => group.id === groupId);

    if (!currentGroup) {
      throw new Error('Group not found.');
    }

    const alreadyJoined = currentGroup.members.some((member) => member.studentId === student.id);

    if (alreadyJoined) {
      return currentGroup;
    }

    const member: GroupMember = {
      id: `m-${Date.now()}`,
      studentId: student.id,
      name: student.name,
    };

    const updatedMembers = [...currentGroup.members, member];
    const nextStatus = updatedMembers.length >= 4 ? 'FULL' : 'WAITING';

    const updatedGroup: Group = {
      ...currentGroup,
      members: updatedMembers,
      status: nextStatus,
    };

    groupsState = groupsState.map((group) => (group.id === groupId ? updatedGroup : group));
    return updatedGroup;
  },

  async getMatchingGroups(pickup: string, destination: string): Promise<Group[]> {
    await delay(200);
    return groupsState.filter(
      (group) => group.pickup === pickup && group.destination === destination,
    );
  },

  async updateGroupStatus(groupId: string, status: Group['status']): Promise<Group> {
    const target = groupsState.find((group) => group.id === groupId);

    if (!target) {
      throw new Error('Group not found.');
    }

    const updatedGroup = { ...target, status };
    groupsState = groupsState.map((group) => (group.id === groupId ? updatedGroup : group));
    return updatedGroup;
  },

  getGroupsState(): Group[] {
    return [...groupsState];
  },

  setGroupsState(groups: Group[]) {
    groupsState = groups;
  },
};
