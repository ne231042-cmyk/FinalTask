import { REST, Routes, SlashCommandBuilder } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const commands = [
  new SlashCommandBuilder()
    .setName("help")
    .setDescription("使い方を表示します"),

  new SlashCommandBuilder()
    .setName("add")
    .setDescription("課題を追加します")
    .addStringOption(option =>
      option
        .setName("subject")
        .setDescription("科目名")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("title")
        .setDescription("課題名")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("deadline")
        .setDescription("締切（例: 2026-07-19）")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("list")
    .setDescription("課題一覧を表示します"),

  new SlashCommandBuilder()
    .setName("done")
    .setDescription("課題を完了にします")
    .addIntegerOption(option =>
      option
        .setName("id")
        .setDescription("課題ID")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("week")
    .setDescription("今週締切の課題を表示します"),
].map(command => command.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

try {
  console.log("スラッシュコマンドを登録しています...");

  await rest.put(
    Routes.applicationGuildCommands(
      process.env.CLIENT_ID,
      process.env.GUILD_ID
    ),
    { body: commands }
  );

  console.log("登録完了！");
} catch (error) {
  console.error(error);
}