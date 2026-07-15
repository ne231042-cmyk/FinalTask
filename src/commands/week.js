import { Op } from "sequelize";
import Task from "../models/Task.js";

export async function week(interaction) {
  try {
    // 1. 今日の日付と、7日後の日付を計算する
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 時間を 00:00:00 にリセット

    const sevenDaysLater = new Date(today);
    sevenDaysLater.setDate(today.getDate() + 7);
    sevenDaysLater.setHours(23, 59, 59, 999); // 7日後の 23:59:59 までを対象にする

    // 2. PostgreSQLから、締切が今日〜7日後まで（未完了）の課題を取得する
    const tasks = await Task.findAll({
      where: {
        userId: interaction.user.id,
        completed: false,
        deadline: {
          [Op.between]: [today, sevenDaysLater] // Sequelizeの「Op.between」で範囲指定
        }
      },
      order: [["deadline", "ASC"]]
    });

    // 3. 該当する課題が1つもない場合
    if (tasks.length === 0) {
      await interaction.reply("📅 今週（7日以内）に締め切りのある課題はありません！余裕ですね。");
      return;
    }

    // 4. メッセージを整形
    let responseMessage = "📅 **今週（7日以内）締切の課題一覧**\n\n";
    
    tasks.forEach((task) => {
      responseMessage += `🆔 **ID: ${task.id}** | 📘 [${task.subject}] ${task.title} (締切: ${task.deadline})\n`;
    });

    // 5. Discordに送信
    await interaction.reply(responseMessage);

  } catch (error) {
    console.error("今週の課題取得中にエラーが発生しました:", error);
    await interaction.reply({
      content: "❌ 課題の取得中にエラーが発生しました。",
      ephemeral: true
    });
  }
}