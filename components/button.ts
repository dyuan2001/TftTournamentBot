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
        const button = new MessageButton()
            .setLabel("Unregister")
            .setEmoji("❌")
            .setStyle("SECONDARY")
            .setCustomId(`unregister-btn-${id}`);
        return button;
    }

    static deleteTournamentButton(id: string): MessageButton {
        let button = new MessageButton()
            .setLabel("Delete")
            .setEmoji("💣")
            .setStyle("DANGER")
            .setCustomId(`delete-tournament-btn-${id}`);
        return button;
    }

    static cancelButton(): MessageButton {
        const button = new MessageButton()
            .setLabel("Cancel")
            .setEmoji("↪️")
            .setStyle("SECONDARY")
            .setCustomId(`cancel-btn`);
        return button;
    }

    static forwardButton(): MessageButton {
        const button = new MessageButton()
            .setEmoji("➡️")
            .setStyle("PRIMARY")
            .setCustomId(`forward-btn`);
        return button;
    }

    static backButton(): MessageButton {
        const button = new MessageButton()
            .setEmoji("⬅️")
            .setStyle("PRIMARY")
            .setCustomId(`back-btn`);
        return button;
    }
}