import { MessageButton } from "discord.js";

export class Button {
    /**
     * Register button for tournaments.
     * @returns Register button component.
     */
    static registerButton(id: string): MessageButton {
        const button = new MessageButton()
            .setLabel("Register")
            .setEmoji("🏆")
            .setStyle("PRIMARY")
            .setCustomId(`register-btn-${id}`);
        return button;
    }

    /**
     * Unregister button for tournaments.
     * @returns Unregister button component.
     */
    static unregisterButton(id: string): MessageButton {
        let button = new MessageButton()
            .setLabel("Unregister")
            .setEmoji("❌")
            .setStyle("SECONDARY")
            .setCustomId(`unregister-btn-${id}`);
        return button;
    }
}