import type { LoginPayload, RegisterPayload, Student } from '../types';
import { students } from '../mock/data';

const delay = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

export const authService = {
  async login(payload: LoginPayload): Promise<Student> {
    await delay(750);

    const match = students.find(
      (student) =>
        (student.email === payload.emailOrPhone || student.phone === payload.emailOrPhone) &&
        student.password === payload.password,
    );

    if (!match) {
      throw new Error('Invalid email/phone or password.');
    }

    return {
      ...match,
      password: undefined,
    };
  },

  async register(payload: RegisterPayload): Promise<Student> {
    await delay(800);

    if (payload.password !== payload.confirmPassword) {
      throw new Error('Passwords do not match.');
    }

    const existing = students.find(
      (student) => student.email === payload.email || student.phone === payload.phone,
    );

    if (existing) {
      throw new Error('A student with that email or phone already exists.');
    }

    const student: Student = {
      id: `stu-${Date.now()}`,
      name: payload.fullName,
      department: payload.department,
      faculty: payload.faculty,
      level: payload.level,
      phone: payload.phone,
      email: payload.email,
      password: payload.password,
    };

    students.push(student);

    return {
      ...student,
      password: undefined,
    };
  },
};
