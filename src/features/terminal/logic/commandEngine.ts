import { useTerminalStore } from '../store/useTerminalStore';
import { useSceneStore } from '../../scenes/store/useSceneStore';
import { useSettingsStore } from '@/shared/store/useSettingsStore';
import { projects } from '@/content/projects';
import { profile } from '@/content/profile';
import { i18n } from '@/shared/lib/i18n';
import { SCENE_NAMES } from '@/shared/constants/scenes';

const t = i18n.global.t;

const SPEED_HELP_TITLE = 15;
const SPEED_HELP_ENTRY = 10;
const SPEED_LS_TITLE = 15;
const SPEED_LS_ENTRY = 10;
const SPEED_LS_LINK = 5;
const SPEED_OPEN_INIT = 20;
const SPEED_OPEN_DECRYPT = 15;
const SPEED_OPEN_CARD_DECOR = 5;
const SPEED_OPEN_CARD_CONTENT = 10;
const SPEED_LINKS_TITLE = 15;
const SPEED_LINKS_ENTRY = 10;
const SPEED_ABOUT_NAME = 25;
const SPEED_ABOUT_BIO = 20;
const SPEED_ABOUT_SKILLS = 15;
const SPEED_TEACH_LOADING = 20;
const SPEED_TEACH_FACT = 15;
const SPEED_LANG_CHANGED = 20;
const SPEED_SENIOR_OVERDRIVE = 10;
const SPEED_REFACTOR_SCANNING = 30;
const SPEED_SUDO_DENIED = 15;

const EXIT_RELOAD_DELAY_MS = 1000;
const REFACTOR_STEP_DELAY_MIN_MS = 200;
const REFACTOR_STEP_DELAY_RAND_MS = 300;

export interface Command {
  name: string;
  descKey: string;
  execute: (args: string[]) => void | Promise<void>;
}

export class CommandEngine {
  private commands: Record<string, Command> = {};
  private terminalStore = useTerminalStore();
  private sceneStore = useSceneStore();
  private settingsStore = useSettingsStore();

  constructor() {
    this.registerDefaultCommands();
  }

  private registerDefaultCommands() {
    this.register({
      name: 'help',
      descKey: 'cmd.help.desc',
      execute: async () => {
        await this.terminalStore.addTypewriterEntry(t('cmd.help.title'), 'system', SPEED_HELP_TITLE);

        const order = [
          'lang',
          'about',
          'echo',
          'matrix',
          'project',
          'refactor',
          'senior-power',
          'sudo',
          'teach',
          'help',
          'clear',
          'exit'
        ];

        const sortedCommands = order
          .map(name => this.commands[name])
          .filter(cmd => !!cmd);

        for (const cmd of sortedCommands) {
          const description = t(cmd.descKey);
          if (this.terminalStore.skipTyping) {
             this.terminalStore.addEntry(`${cmd.name.padEnd(15)} - ${description}`, 'output');
          } else {
             await this.terminalStore.addTypewriterEntry(`${cmd.name.padEnd(15)} - ${description}`, 'output', SPEED_HELP_ENTRY);
          }
        }
      }
    });

    this.register({
      name: 'project',
      descKey: 'cmd.project.desc',
      execute: async (args) => {
        const category = args[0]?.toLowerCase() || 'projects';
        if (category === 'projects') {
          await this.terminalStore.addTypewriterEntry(t('cmd.ls.projects'), 'system', SPEED_LS_TITLE);
          for (let i = 0; i < projects.length; i++) {
            const p = projects[i];
            if (!p) continue;
            const index = i + 1;
            await this.terminalStore.addTypewriterEntry(`${index}) ${t(p.name)} - ${t(p.summary)} (${p.techStack.join(', ')})`, 'output', SPEED_LS_ENTRY);
            if (p.description) await this.terminalStore.addTypewriterEntry(`   ${t(p.description)}`, 'output', SPEED_LS_ENTRY);
            if (p.links.demo) await this.terminalStore.addTypewriterEntry(`   demo: ${p.links.demo}`, 'success', SPEED_LS_LINK);
            if (p.links.github) await this.terminalStore.addTypewriterEntry(`   git : ${p.links.github}`, 'success', SPEED_LS_LINK);
            if (p.links.case) await this.terminalStore.addTypewriterEntry(`   case: ${p.links.case}`, 'success', SPEED_LS_LINK);
            this.terminalStore.addEntry('', 'output'); // Spacer
          }
          this.sceneStore.setScene(SCENE_NAMES.PROJECTS);
        } else {
          this.terminalStore.addEntry(t('cmd.project.usage'), 'warning');
        }
      }
    });


    this.register({
      name: 'about',
      descKey: 'cmd.about.desc',
      execute: async () => {
        this.sceneStore.setScene(SCENE_NAMES.ASCII_ASSEMBLE, { ascii: profile.asciiPortrait });
        await this.terminalStore.addTypewriterEntry(`${t('cmd.about.identified')} ${t(profile.name)}`, 'success', SPEED_ABOUT_NAME);
        await this.terminalStore.addTypewriterEntry(`${t('cmd.about.role')}       ${t(profile.title)}`, 'output', SPEED_ABOUT_BIO);
        this.terminalStore.addEntry('', 'output');
        await this.terminalStore.addTypewriterEntry(`${t('cmd.about.bio')}        ${t(profile.bio)}`, 'output', SPEED_ABOUT_BIO);
        this.terminalStore.addEntry('', 'output');
        await this.terminalStore.addTypewriterEntry(`${t('cmd.about.skills')}     ${profile.skills.join(', ')}`, 'output', SPEED_ABOUT_SKILLS);
        this.terminalStore.addEntry('', 'output');
        await this.terminalStore.addTypewriterEntry(`${t('cmd.about.location')}   ${t(profile.location)}`, 'system', SPEED_ABOUT_BIO);
        this.terminalStore.addEntry('', 'output');
        await this.terminalStore.addTypewriterEntry(`${t('cmd.about.status')}     ${t(profile.status)}`, 'system', SPEED_ABOUT_BIO);
      }
    });

    this.register({
      name: 'teach',
      descKey: 'cmd.teach.desc',
      execute: async () => {
        await this.terminalStore.addTypewriterEntry(t('cmd.teach.loading'), 'system', SPEED_TEACH_LOADING);
        const facts = i18n.global.tm('cmd.teach.facts') as string[];
        const randomFact = facts[Math.floor(Math.random() * facts.length)] || '';
        await this.terminalStore.addTypewriterEntry(randomFact, 'output', SPEED_TEACH_FACT);
      }
    });

    this.register({
      name: 'matrix',
      descKey: 'cmd.matrix.desc',
      execute: () => {
        this.terminalStore.addEntry(t('cmd.matrix.follow'), 'success');
        this.sceneStore.setScene(SCENE_NAMES.MATRIX);
      }
    });

    this.register({
      name: 'clear',
      descKey: 'cmd.clear.desc',
      execute: () => {
        this.terminalStore.clearHistory();
      }
    });

    this.register({
      name: 'exit',
      descKey: 'cmd.exit.desc',
      execute: async () => {
        await this.terminalStore.addTypewriterEntry(t('cmd.exit.terminating'), 'error');
        await this.terminalStore.addTypewriterEntry(t('cmd.exit.goodbye'), 'system');
        this.sceneStore.setScene(SCENE_NAMES.IDLE);
        setTimeout(() => {
          window.location.reload();
        }, EXIT_RELOAD_DELAY_MS);
      }
    });

    this.register({
      name: 'echo',
      descKey: 'cmd.echo.desc',
      execute: (args) => {
        this.terminalStore.addEntry(args.join(' '), 'output');
      }
    });

    this.register({
      name: 'lang',
      descKey: 'cmd.lang.desc',
      execute: async (args) => {
        const newLang = args[0]?.toLowerCase();
        if (!newLang) {
          this.terminalStore.addEntry(t('cmd.lang.current', { lang: this.settingsStore.lang }), 'system');
          this.terminalStore.addEntry(t('cmd.lang.available'), 'output');
          return;
        }

        if (newLang === 'ru' || newLang === 'en') {
          this.settingsStore.setLang(newLang);
          await this.terminalStore.addTypewriterEntry(t('cmd.lang.changed', { lang: newLang }), 'success', SPEED_LANG_CHANGED);
        } else {
          this.terminalStore.addEntry(t('cmd.lang.usage'), 'error');
        }
      }
    });

    // --- EASTER EGGS ---
    this.register({
      name: 'senior-power',
      descKey: 'cmd.senior.desc',
      execute: async () => {
        const isSenior = this.terminalStore.theme === 'senior';
        if (isSenior) {
          this.terminalStore.setTheme('default');
          await this.terminalStore.addTypewriterEntry(t('cmd.senior.deactivated'), 'system');
        } else {
          this.terminalStore.setTheme('senior');
          await this.terminalStore.addTypewriterEntry(t('cmd.senior.activated'), 'error');
          await this.terminalStore.addTypewriterEntry(t('cmd.senior.overdrive'), 'error', SPEED_SENIOR_OVERDRIVE);
        }
      }
    });

    this.register({
      name: 'refactor',
      descKey: 'cmd.refactor.desc',
      execute: async () => {
        await this.terminalStore.addTypewriterEntry(t('cmd.refactor.scanning'), 'system', SPEED_REFACTOR_SCANNING);
        this.terminalStore.addEntry('[                    ] 0%', 'output');

        for (let i = 1; i <= 10; i++) {
          await new Promise(resolve => setTimeout(resolve, REFACTOR_STEP_DELAY_MIN_MS + Math.random() * REFACTOR_STEP_DELAY_RAND_MS));
          const progress = i * 10;
          const bars = '#'.repeat(i * 2).padEnd(20, ' ');
          this.terminalStore.updateLastEntry(`[${bars}] ${progress}%`);
        }

        await this.terminalStore.addTypewriterEntry(t('cmd.refactor.complete'), 'success');
      }
    });

    this.register({
      name: 'sudo',
      descKey: 'cmd.sudo.desc',
      execute: async () => {
        await this.terminalStore.addTypewriterEntry(t('cmd.sudo.denied'), 'error', SPEED_SUDO_DENIED);
      }
    });
  }

  register(command: Command) {
    this.commands[command.name.toLowerCase()] = command;
  }

  async execute(input: string) {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    this.terminalStore.skipTyping = false;
    this.terminalStore.addEntry(`${t('terminal.prompt')} ${trimmedInput}`, 'command');
    this.terminalStore.addToCommandHistory(trimmedInput);

    const [cmdName, ...args] = trimmedInput.split(/\s+/);
    if (!cmdName) return;

    const command = this.commands[cmdName.toLowerCase()];

    if (command) {
      await command.execute(args);
    } else {
      this.terminalStore.addEntry(t('errors.unknownCommand', { cmd: cmdName }), 'error');
    }
  }

  autocomplete(input: string): string {
    if (!input) return '';

    const cmdNames = Object.keys(this.commands);
    // Check if there's a space at the end to determine if we're autocompleting a command or an argument
    const hasTrailingSpace = input.endsWith(' ');
    const parts = input.trim().split(/\s+/);

    // Autocomplete command name
    if (parts.length === 1 && !hasTrailingSpace && parts[0]) {
      const matches = cmdNames.filter(name => name.startsWith(parts[0]!.toLowerCase()));
      if (matches.length === 1 && matches[0]) {
        return matches[0] + ' ';
      }
      if (matches.length > 1) {
        this.terminalStore.addEntry(t('errors.autocompleteMatches', { matches: matches.join(', ') }), 'system');
      }
    }
    // Autocomplete subcommands and slugs
    else if (parts.length === 1 && hasTrailingSpace && parts[0]) {
      const cmd = parts[0].toLowerCase();
      if (cmd === 'project') {
        this.terminalStore.addEntry(t('errors.autocompleteMatches', { matches: 'projects' }), 'system');
      }
    }
    else if (parts.length === 2 && parts[0] && parts[1]) {
      const cmd = parts[0].toLowerCase();
      const arg = parts[1].toLowerCase();
      if (cmd === 'project') {
        const sub = ['projects'].find(s => s.startsWith(arg));
        if (sub) return `project ${sub} `;
      }
    }

    return input;
  }
}

// Singleton instance
let engineInstance: CommandEngine | null = null;

export function useCommandEngine() {
  if (!engineInstance) {
    engineInstance = new CommandEngine();
  }
  return engineInstance;
}
