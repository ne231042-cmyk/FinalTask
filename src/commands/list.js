import Task from "../models/Task.js";

export async function list(interaction) {
  try {
    // 1. PostgreSQLからこのユーザーの「未完了(completed: false)」の課題を締め切り順で取得
    const tasks = await Task.findAll({
      where: {
        userId: interaction.user.id,
        completed: false
      },
      order: [["deadline", "ASC"]] // 締め切りが近い順に並び替え
    });

    // 2. 課題が1つもない場合の処理
    if (tasks.length === 0) {
      await interaction.reply("📅 現在、残っている課題はありません！素晴らしいですね！");
      return;
    }

    // 3. 取得した課題をメッセージ用に整形する
    let responseMessage = "📚 **現在の未完了課題一覧（締切順）**\n\n";
    
    tasks.forEach((task) => {
      responseMessage += `🆔 **ID: ${task.id}** | 📘 [${task.subject}] ${task.title} (締切: ${task.deadline})\n`;
    });

    // 4. Discordに一覧を返信する
    await interaction.reply(responseMessage);

  } catch (error) {
    console.error("課題一覧の取得中にエラーが発生しました:", error);
    await interaction.reply({
      content: "❌ 課題一覧の取得中にエラーが発生しました。",
      ephemeral: true
    });
  }
}