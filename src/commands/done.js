import Task from "../models/Task.js";

export async function done(interaction) {
  try {
    // Discordの入力フォームから、完了にしたい課題のIDを取得する
    const taskId = interaction.options.getInteger("id");

    // PostgreSQLから該当の課題を探す（自分の課題かつ、未完了のもの）
    const task = await Task.findOne({
      where: {
        id: taskId,
        userId: interaction.user.id,
        completed: false
      }
    });

    // 課題が見つからなかった場合の処理
    if (!task) {
      await interaction.reply({
        content: `❌ ID: ${taskId} の未完了課題が見つかりません。IDが正しいか、すでに完了していないか確認してください。`,
        ephemeral: true // 本人にだけ見えるエラーメッセージ
      });
      return;
    }

    // 課題を「完了（true）」にして保存する
    task.completed = true;
    await task.save();

    // Discordに返信する
    await interaction.reply(`🎉 課題を完了にしました！\n📘 **[${task.subject}] ${task.title}**`);

  } catch (error) {
    console.error("課題の完了処理中にエラーが発生しました:", error);
    await interaction.reply({
      content: "❌ 課題の完了処理中にエラーが発生しました。",
      ephemeral: true
    });
  }
}