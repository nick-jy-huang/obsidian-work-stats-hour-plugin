import {App, PluginSettingTab, Setting} from "obsidian";
import WorkHourStatsPlugin from "./main";

export interface MyPluginSettings {
	workingDaysPerWeek: number;
	hoursPerDay: number;
}

export const DEFAULT_SETTINGS: MyPluginSettings = {
	workingDaysPerWeek: 5,
	hoursPerDay: 8,
}

export class SampleSettingTab extends PluginSettingTab {
	plugin: WorkHourStatsPlugin;

	constructor(app: App, plugin: WorkHourStatsPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Working days per week')
			.setDesc('Used to estimate expected hours')
			.addText(text => text
				.setPlaceholder('5')
				.setValue(String(this.plugin.settings.workingDaysPerWeek))
				.onChange(async (value) => {
					const parsed = Number(value);
					const clamped = Number.isFinite(parsed) ? Math.min(Math.max(Math.round(parsed), 0), 7) : 5;
					this.plugin.settings.workingDaysPerWeek = clamped;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Hours per working day')
			.setDesc('Daily target for expected hours calculation')
			.addText(text => text
				.setPlaceholder('8')
				.setValue(String(this.plugin.settings.hoursPerDay))
				.onChange(async (value) => {
					const parsed = Number(value);
					const clamped = Number.isFinite(parsed) ? Math.min(Math.max(Math.round(parsed), 1), 24) : 8;
					this.plugin.settings.hoursPerDay = clamped;
					await this.plugin.saveSettings();
				}));

	}
}
