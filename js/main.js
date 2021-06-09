'use strict'

{
  const question = document.getElementById('question')
  const choices = document.getElementById('choices')
  const btn = document.getElementById('btn')
  const result = document.getElementById('result')
  const scoreLabel = document.querySelector('#result > p'); //#をつけてCSSの文字列をとりにいってる。こういう指定の仕方の方が柔軟にできる

  // 音を出すための準備
  const soundCorrect = new Audio("Pinpon.mp3");
  const soundWrong = new Audio("Bubu.mp3");
  const soundFanfare = new Audio("Fanfare.mp3");
  const soundOk = new Audio("Ok.mp3");
  const soundBad = new Audio("Bad.mp3");

  const quizSet = shuffle([ //shuffle().splice()で、シャッフルした問題の中から特定の数を出す。
    {q: 'ポケモンの しゅじんこうは？', c:['サトシ', 'ひとし', 'フトシ']},
    {q: 'はるの　つぎのきせつは？', c:['なつ', 'あき', 'ふゆ']},
    {q: 'サトシといつもいっしょにいるのは？', c:['ピカチュウ', 'ライチュウ', 'ニャース']},
    {q: 'イヌとネコは　どっちが　ながいき？', c:['ネコ', 'イヌ', 'おなじ']},
    {q: 'コーンフレークは　なにからできてる？', c:['とうもろこし', 'じゃがいも', 'こむぎこ']},
    {q: 'こうえんでいつもぶらぶらしているにんきものは？', c:['ぶらんこ', 'しーそー', 'じゃんぐるじむ']},
    {q: 'くりはくりでもおどろいているくりは？', c:['びっくり', 'どっきり', 'しゃっくり']},
    {q: 'こんちゅうの あしは なんほん？', c:['６ほん', '８ほん', '２ほん']},
    {q: 'いちばん あつい きせつは？', c:['なつ', 'ふゆ', 'あき']},
    {q: 'おはしは ２ほんそろうと なんという？', c:['いちぜん', 'こっぷ', 'すぷーん']},
    {q: 'よる ねるときの あいさつは？', c:['おやすみなさい', 'おはようございます', 'ありがとうございます']},
    {q: 'おにがにぎっているたべものは？', c:['おにぎり', 'サンドイッチ', 'おいなり']},
    {q: 'おしょうがつは なんがつ なんにち？', c:['１がつ１にち', '２がつ３にち', '３がつ３にち']},
    {q: '５がつ５にちは　なんのひ？', c:['こどものひ', 'ひなまつり', 'おしょうがつ']},
    {q: 'じてんしゃのタイヤはいくつ？', c:['２つ', '３つ', '４つ']},
    {q: '「かきくけこ」のなかにあるくだものは？', c:['かき', 'りんご', 'なし']},
  ]).splice(0, 3); //spliceをつかうことで、最初の3個を取り出せる
  let currentNum = 0; //いま何問目かの変数
  let isAnswered;
  let score = 0; //正解数を数えるための変数
  
  //フィッシャー・イエーツのシャッフル(配列の最後とランダムな場所を入れ替えて選択肢を狭めるを繰り返す)
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[j], arr[i]] =[arr[i], arr[j]];
    }
    return arr;
  }

  function checkAnswer(li) {
    // if(isAnsewered === true) { ===trueは省略できる
    // 回答済みだったら以降の処理を行わないようにReturn
    if(isAnswered) {
      return;
    }
    isAnswered = true;

    if (li.textContent === quizSet[currentNum].c[0] ){
      soundCorrect.load();
      soundCorrect.play();
      li.classList.add('correct');
      score++;
    } else {
      soundWrong.load();
      soundWrong.play();
      li.classList.add('wrong');
    }

    btn.classList.remove('disabled') //回答を選んだらdisabledをはずす
  }
  
  function setQuiz() {
    isAnswered = false; //初期状態ではisAnsewredを無効化
    question.textContent = quizSet[currentNum].q; //quizSetのcurrentNum番目の問題

    //問題を進んだときに前の問題をクリアする処理。これをしないと、liがどんどん追加されて行ってしまう
    while(choices.firstChild) {
      choices.removeChild(choices.firstChild);
    }

    // 引数にquizset[currentNum].cとしてしまうと、だめ。スプレッド演算子を使うことで新しい配列を作り、配列そのものを入れ替えるのではなく表示だけ変更する
    const shuffledChoices = shuffle([...quizSet[currentNum].c]);
  
     //答えの方もこれでli要素を作る
    shuffledChoices.forEach(choice => { //choiceには上の配列の要素がひとつづつ入ってくる
      const li = document.createElement('li');
      li.textContent = choice;
      li.addEventListener('click',() => {
        checkAnswer(li);
      });
      choices.appendChild(li);
    });

    //最後の問題になったとき（currentNumがquizSet.lengthより一つ小さいとき）の処理
    if (currentNum === quizSet.length - 1) {
      btn.textContent = 'おしまい　なんてんかな';

    }

  }


  setQuiz();

  //次の問題へ進む処理
  btn.addEventListener('click', () => {
    if (btn.classList.contains('disabled')) {
      return; //これにより、ボタンがグレーだと押せない（次の処理に進まない）
    }
    btn.classList.add('disabled') //次の問題に言ったときにボタンをグレーに戻すため

    // 最後の問題だったら点数を表示して、それ以外だったら次の問題に進む
    if (currentNum === quizSet.length - 1) {
      // console.log(`てんすう：${score} / ${quizSet.length}`);
      scoreLabel.textContent =  (`てんすう：${score} / ${quizSet.length}`);
      if (score == 3) {
        soundFanfare.load();
        soundFanfare.play();
      }else if(score != 0) {
        soundOk.load();
        soundOk.play();
      }else {
        soundBad.load();
        soundBad.play();
      }
      result.classList.remove('hidden') //hiddenクラスを外して点数を呼び出す
    }else {
      currentNum++;
      setQuiz();
    }

  });

}