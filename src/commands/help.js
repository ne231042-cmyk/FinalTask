export async function help(interaction) {

  await interaction.reply(
`📚 課題管理Bot

/add
課題を追加します

/list
登録されている課題を表示します

/done
課題を完了にします

/week
今週締切の課題を表示します

/help
この説明を表示します`
  );

}