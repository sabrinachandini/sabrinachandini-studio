import fs from 'fs';
import path from 'path';
import {
  ObsessionSchema,
  QuestionSchema,
  QuestionNoteSchema,
  LogEntrySchema,
  GuestbookEntrySchema,
  LinkedInWorkItemSchema,
  LinkedInPostSchema,
  LinkedInProfileSchema,
  QuestionAnswerSchema,
  ObsessionEditLogSchema,
  type Obsession,
  type Question,
  type QuestionNote,
  type LogEntry,
  type GuestbookEntry,
  type LinkedInWorkItem,
  type LinkedInPost,
  type LinkedInProfile,
  type QuestionAnswer,
  type ObsessionEditLog,
} from '@/types/content';

const DATA_DIR = path.join(process.cwd(), 'data');

// =============================================================================
// HELPERS
// =============================================================================

function readJsonFile<T>(filename: string): T {
  const filePath = path.join(DATA_DIR, filename);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

function writeJsonFile<T>(filename: string, data: T): void {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// =============================================================================
// OBSESSIONS
// =============================================================================

export async function getObsessions(): Promise<Obsession[]> {
  const raw = readJsonFile<unknown[]>('obsessions.json');
  return raw.map((item) => ObsessionSchema.parse(item));
}

export async function getActiveObsession(): Promise<Obsession | null> {
  const obsessions = await getObsessions();
  return obsessions.find((o) => o.status === 'active') ?? null;
}

export async function getArchivedObsessions(): Promise<Obsession[]> {
  const obsessions = await getObsessions();
  return obsessions
    .filter((o) => o.status === 'archived')
    .sort((a, b) => b.month.localeCompare(a.month));
}

export async function saveObsession(obsession: Obsession): Promise<void> {
  const obsessions = await getObsessions();
  const index = obsessions.findIndex((o) => o.id === obsession.id);
  if (index >= 0) {
    obsessions[index] = obsession;
  } else {
    obsessions.push(obsession);
  }
  writeJsonFile('obsessions.json', obsessions);
}

export async function createObsession(
  data: Omit<Obsession, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Obsession> {
  const now = new Date().toISOString();
  const obsession: Obsession = {
    ...data,
    id: generateId('obs'),
    createdAt: now,
    updatedAt: now,
  };
  await saveObsession(obsession);
  return obsession;
}

// =============================================================================
// QUESTIONS
// =============================================================================

export async function getQuestions(): Promise<Question[]> {
  const raw = readJsonFile<unknown[]>('questions.json');
  return raw.map((item) => QuestionSchema.parse(item));
}

export async function getQuestion(slug: string): Promise<Question | null> {
  const questions = await getQuestions();
  return questions.find((q) => q.slug === slug) ?? null;
}

export async function saveQuestion(question: Question): Promise<void> {
  const questions = await getQuestions();
  const index = questions.findIndex((q) => q.slug === question.slug);
  if (index >= 0) {
    questions[index] = question;
  } else {
    questions.push(question);
  }
  writeJsonFile('questions.json', questions);
}

// =============================================================================
// QUESTION NOTES
// =============================================================================

export async function getQuestionNotes(questionSlug?: string): Promise<QuestionNote[]> {
  const raw = readJsonFile<unknown[]>('question-notes.json');
  const notes = raw.map((item) => QuestionNoteSchema.parse(item));

  if (questionSlug) {
    return notes
      .filter((n) => n.questionSlug === questionSlug)
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  return notes.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getQuestionNote(id: string): Promise<QuestionNote | null> {
  const notes = await getQuestionNotes();
  return notes.find((n) => n.id === id) ?? null;
}

export async function getRecentQuestionNotes(limit = 3): Promise<QuestionNote[]> {
  const notes = await getQuestionNotes();
  return notes.slice(0, limit);
}

export async function getQuestionNotesByType(type: string): Promise<QuestionNote[]> {
  const notes = await getQuestionNotes();
  return notes.filter((n) => n.type === type);
}

export async function getQuestionNotesByTrack(track: string): Promise<QuestionNote[]> {
  const notes = await getQuestionNotes();
  return notes.filter((n) => n.tracks.includes(track as 'startups' | 'history' | 'both'));
}

export async function saveQuestionNote(note: QuestionNote): Promise<void> {
  const notes = await getQuestionNotes();
  const index = notes.findIndex((n) => n.id === note.id);
  if (index >= 0) {
    notes[index] = note;
  } else {
    notes.push(note);
  }
  writeJsonFile('question-notes.json', notes);
}

export async function createQuestionNote(
  data: Omit<QuestionNote, 'id' | 'createdAt' | 'updatedAt'>
): Promise<QuestionNote> {
  const now = new Date().toISOString();
  const note: QuestionNote = {
    ...data,
    id: generateId('qn'),
    createdAt: now,
    updatedAt: now,
  };
  await saveQuestionNote(note);
  return note;
}

export async function deleteQuestionNote(id: string): Promise<void> {
  const notes = await getQuestionNotes();
  const filtered = notes.filter((n) => n.id !== id);
  writeJsonFile('question-notes.json', filtered);
}

// =============================================================================
// BUILD LOG
// =============================================================================

export async function getLogEntries(): Promise<LogEntry[]> {
  const raw = readJsonFile<unknown[]>('log.json');
  return raw
    .map((item) => LogEntrySchema.parse(item))
    .sort((a, b) => b.dateTime.localeCompare(a.dateTime));
}

export async function getRecentLogEntries(limit = 7): Promise<LogEntry[]> {
  const entries = await getLogEntries();
  return entries.slice(0, limit);
}

export async function getLogEntriesByTag(tag: string): Promise<LogEntry[]> {
  const entries = await getLogEntries();
  return entries.filter((e) => e.tags?.includes(tag));
}

export async function saveLogEntry(entry: LogEntry): Promise<void> {
  const entries = await getLogEntries();
  const index = entries.findIndex((e) => e.id === entry.id);
  if (index >= 0) {
    entries[index] = entry;
  } else {
    entries.push(entry);
  }
  writeJsonFile('log.json', entries);
}

export async function createLogEntry(
  data: Omit<LogEntry, 'id' | 'createdAt' | 'updatedAt'>
): Promise<LogEntry> {
  const now = new Date().toISOString();
  const entry: LogEntry = {
    ...data,
    id: generateId('log'),
    createdAt: now,
    updatedAt: now,
  };
  await saveLogEntry(entry);
  return entry;
}

export async function deleteLogEntry(id: string): Promise<void> {
  const entries = await getLogEntries();
  const filtered = entries.filter((e) => e.id !== id);
  writeJsonFile('log.json', filtered);
}

// =============================================================================
// GUESTBOOK
// =============================================================================

export async function getGuestbookEntries(): Promise<GuestbookEntry[]> {
  const raw = readJsonFile<unknown[]>('guestbook.json');
  return raw
    .map((item) => GuestbookEntrySchema.parse(item))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getPublishedGuestbookEntries(): Promise<GuestbookEntry[]> {
  const entries = await getGuestbookEntries();
  return entries.filter((e) => e.status === 'published');
}

export async function getPendingGuestbookEntries(): Promise<GuestbookEntry[]> {
  const entries = await getGuestbookEntries();
  return entries.filter((e) => e.status === 'pending');
}

export async function saveGuestbookEntry(entry: GuestbookEntry): Promise<void> {
  const entries = await getGuestbookEntries();
  const index = entries.findIndex((e) => e.id === entry.id);
  if (index >= 0) {
    entries[index] = entry;
  } else {
    entries.push(entry);
  }
  writeJsonFile('guestbook.json', entries);
}

export async function createGuestbookEntry(
  data: Omit<GuestbookEntry, 'id' | 'createdAt' | 'updatedAt'>
): Promise<GuestbookEntry> {
  const now = new Date().toISOString();
  const entry: GuestbookEntry = {
    ...data,
    id: generateId('gb'),
    createdAt: now,
    updatedAt: now,
  };
  await saveGuestbookEntry(entry);
  return entry;
}

// =============================================================================
// LINKEDIN PROVIDER SYSTEM
// =============================================================================

export interface LinkedInProvider {
  getProfile(): Promise<LinkedInProfile | null>;
  getWorkExperience(): Promise<LinkedInWorkItem[]>;
  getRecentPosts(): Promise<LinkedInPost[]>;
}

// Provider 1: Manual (JSON files)
class ManualLinkedInProvider implements LinkedInProvider {
  async getProfile(): Promise<LinkedInProfile | null> {
    try {
      const raw = readJsonFile<unknown>('linkedin/profile.json');
      return LinkedInProfileSchema.parse(raw);
    } catch {
      return null;
    }
  }

  async getWorkExperience(): Promise<LinkedInWorkItem[]> {
    try {
      const raw = readJsonFile<unknown[]>('linkedin/work.json');
      return raw.map((item) => LinkedInWorkItemSchema.parse(item));
    } catch {
      return [];
    }
  }

  async getRecentPosts(): Promise<LinkedInPost[]> {
    try {
      const raw = readJsonFile<unknown[]>('linkedin/posts.json');
      return raw
        .map((item) => LinkedInPostSchema.parse(item))
        .sort((a, b) => b.postedAt.localeCompare(a.postedAt));
    } catch {
      return [];
    }
  }
}

// Provider 2: Official API (stub)
class OfficialLinkedInProvider implements LinkedInProvider {
  private fallback = new ManualLinkedInProvider();

  private isConfigured(): boolean {
    // Check if Official LinkedIn API credentials are present
    return !!(
      process.env.LINKEDIN_CLIENT_ID &&
      process.env.LINKEDIN_CLIENT_SECRET &&
      process.env.LINKEDIN_ACCESS_TOKEN
    );
  }

  async getProfile(): Promise<LinkedInProfile | null> {
    if (!this.isConfigured()) {
      return this.fallback.getProfile();
    }
    // TODO: Implement Official LinkedIn API call
    // For now, fall back to manual
    return this.fallback.getProfile();
  }

  async getWorkExperience(): Promise<LinkedInWorkItem[]> {
    if (!this.isConfigured()) {
      return this.fallback.getWorkExperience();
    }
    // TODO: Implement Official LinkedIn API call
    return this.fallback.getWorkExperience();
  }

  async getRecentPosts(): Promise<LinkedInPost[]> {
    if (!this.isConfigured()) {
      return this.fallback.getRecentPosts();
    }
    // TODO: Implement Official LinkedIn API call
    return this.fallback.getRecentPosts();
  }
}

// Export the active provider (switches based on feature flag)
function getLinkedInProvider(): LinkedInProvider {
  if (process.env.LINKEDIN_USE_OFFICIAL_API === 'true') {
    return new OfficialLinkedInProvider();
  }
  return new ManualLinkedInProvider();
}

export const linkedInProvider = getLinkedInProvider();

// Direct access functions for convenience
export async function getLinkedInProfile(): Promise<LinkedInProfile | null> {
  return linkedInProvider.getProfile();
}

export async function getLinkedInWorkExperience(): Promise<LinkedInWorkItem[]> {
  return linkedInProvider.getWorkExperience();
}

export async function getLinkedInPosts(): Promise<LinkedInPost[]> {
  return linkedInProvider.getRecentPosts();
}

// Manual provider write functions (for admin)
export async function saveLinkedInProfile(profile: LinkedInProfile): Promise<void> {
  writeJsonFile('linkedin/profile.json', profile);
}

export async function saveLinkedInWorkItem(item: LinkedInWorkItem): Promise<void> {
  const items = await getLinkedInWorkExperience();
  const index = items.findIndex((i) => i.id === item.id);
  if (index >= 0) {
    items[index] = item;
  } else {
    items.push(item);
  }
  writeJsonFile('linkedin/work.json', items);
}

export async function createLinkedInWorkItem(
  data: Omit<LinkedInWorkItem, 'id' | 'createdAt' | 'updatedAt'>
): Promise<LinkedInWorkItem> {
  const now = new Date().toISOString();
  const item: LinkedInWorkItem = {
    ...data,
    id: generateId('work'),
    createdAt: now,
    updatedAt: now,
  };
  await saveLinkedInWorkItem(item);
  return item;
}

export async function deleteLinkedInWorkItem(id: string): Promise<void> {
  const items = await getLinkedInWorkExperience();
  const filtered = items.filter((i) => i.id !== id);
  writeJsonFile('linkedin/work.json', filtered);
}

export async function saveLinkedInPost(post: LinkedInPost): Promise<void> {
  const posts = await getLinkedInPosts();
  const index = posts.findIndex((p) => p.id === post.id);
  if (index >= 0) {
    posts[index] = post;
  } else {
    posts.push(post);
  }
  writeJsonFile('linkedin/posts.json', posts);
}

export async function createLinkedInPost(
  data: Omit<LinkedInPost, 'id' | 'createdAt' | 'updatedAt'>
): Promise<LinkedInPost> {
  const now = new Date().toISOString();
  const post: LinkedInPost = {
    ...data,
    id: generateId('post'),
    createdAt: now,
    updatedAt: now,
  };
  await saveLinkedInPost(post);
  return post;
}

export async function deleteLinkedInPost(id: string): Promise<void> {
  const posts = await getLinkedInPosts();
  const filtered = posts.filter((p) => p.id !== id);
  writeJsonFile('linkedin/posts.json', filtered);
}

// =============================================================================
// QUESTION ANSWERS
// =============================================================================

export async function getQuestionAnswers(questionSlug?: string): Promise<QuestionAnswer[]> {
  const raw = readJsonFile<unknown[]>('question-answers.json');
  const answers = raw.map((item) => QuestionAnswerSchema.parse(item));

  if (questionSlug) {
    return answers
      .filter((a) => a.questionSlug === questionSlug)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  return answers.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getPublishedQuestionAnswers(questionSlug: string): Promise<QuestionAnswer[]> {
  const answers = await getQuestionAnswers(questionSlug);
  return answers.filter((a) => a.status === 'published');
}

export async function getPendingQuestionAnswers(): Promise<QuestionAnswer[]> {
  const answers = await getQuestionAnswers();
  return answers.filter((a) => a.status === 'pending');
}

export async function saveQuestionAnswer(answer: QuestionAnswer): Promise<void> {
  const answers = await getQuestionAnswers();
  const index = answers.findIndex((a) => a.id === answer.id);
  if (index >= 0) {
    answers[index] = answer;
  } else {
    answers.push(answer);
  }
  writeJsonFile('question-answers.json', answers);
}

export async function createQuestionAnswer(
  data: Omit<QuestionAnswer, 'id' | 'createdAt' | 'updatedAt'>
): Promise<QuestionAnswer> {
  const now = new Date().toISOString();
  const answer: QuestionAnswer = {
    ...data,
    id: generateId('qa'),
    createdAt: now,
    updatedAt: now,
  };
  await saveQuestionAnswer(answer);
  return answer;
}

// =============================================================================
// OBSESSION EDIT LOG
// =============================================================================

export async function getObsessionEditLogs(obsessionId?: string): Promise<ObsessionEditLog[]> {
  const raw = readJsonFile<unknown[]>('obsession-edit-log.json');
  const logs = raw.map((item) => ObsessionEditLogSchema.parse(item));

  if (obsessionId) {
    return logs
      .filter((l) => l.obsessionId === obsessionId)
      .sort((a, b) => b.editedAt.localeCompare(a.editedAt));
  }

  return logs.sort((a, b) => b.editedAt.localeCompare(a.editedAt));
}

export async function createObsessionEditLog(
  data: Omit<ObsessionEditLog, 'id'>
): Promise<ObsessionEditLog> {
  const logs = await getObsessionEditLogs();
  const log: ObsessionEditLog = {
    ...data,
    id: generateId('oel'),
  };
  logs.push(log);
  writeJsonFile('obsession-edit-log.json', logs);
  return log;
}
