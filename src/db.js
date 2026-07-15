import { Client, GatewayIntentBits, Events } from "discord.js";
import dotenv from "dotenv";
import sequelize from "./db.js";
import Task from "./models/Task.js";
import { help } from "./commands/help.js";
import { add } from "./commands/add.js";
import { list } from "./commands/list.js";
import { done } from "./commands/done.js";
import { week } from "./commands/week.js"; // 追記箇所①

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, async (readyClient) => {
  await sequelize.sync();
  console.log("データベース接続成功");
  console.log(`${readyClient.user.tag} としてログインしました`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "help") {
    await help(interaction);
  }
  
  if (interaction.commandName === "add") {
    await add(interaction);
  }

  if (interaction.commandName === "list") {
    await list(interaction);
  }

  if (interaction.commandName === "done") {
    await done(interaction);
  }

  // 追記箇所②
  if (interaction.commandName === "week") {
    await week(interaction);
  }
});

client.login(process.env.DISCORD_TOKEN);