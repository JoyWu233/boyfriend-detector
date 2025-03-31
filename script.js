const { createApp, ref, reactive, computed, watch } = Vue;

// 完整题库
const questionPool = [
  {
    text: "TA是否会突然联系不上？",
    options: [
      { text: "偶尔忙着拯救世界，稍后回复", weight: 5 },
      { text: "经常消失，可能去火星了", weight: 20 },
      { text: "一般都会提前说明，靠谱得很", weight: -10 }
    ]
  },
  {
    text: "你们吵架时TA的态度是？",
    options: [
      { text: "先冷静，后沟通，像个哲学家", weight: -5 },
      { text: "说'你爱怎么想就怎么想'，像个艺术家", weight: 20 },
      { text: "互相妥协，各让一步，像个外交官", weight: 0 }
    ]
  },
  {
    text: "TA的社交账号特征是？",
    options: [
      { text: "经常点赞异性动态，社交达人", weight: 10 },
      { text: "偶尔分享生活和工作，低调派", weight: 0 },
      { text: "会发你们的日常合照，秀恩爱狂魔", weight: -10 }
    ]
  },
  {
    text: "TA对金钱的态度是？",
    options: [
      { text: "能省则省，精打细算，理财小能手", weight: 5 },
      { text: "大方，但记账很清楚，精明的土豪", weight: -5 },
      { text: "借钱时总说马上还，未来的富翁", weight: 20 }
    ]
  },
  {
    text: "发现你不开心时TA会？",
    options: [
      { text: "买礼物哄你开心，购物疗法", weight: 5 },
      { text: "主动沟通找原因，心灵导师", weight: -10 },
      { text: "装作没发现继续忙自己的，工作狂", weight: 15 }
    ]
  },
  {
    text: "关于TA的手机使用？",
    options: [
      { text: "和你在一起时很少玩手机，专注型", weight: -10 },
      { text: "收到消息立刻躲着看，神秘型", weight: 20 },
      { text: "该玩玩，该放放，随性型", weight: 5 }
    ]
  },
  {
    text: "TA和异性相处的方式？",
    options: [
      { text: "保持礼貌但有距离，绅士型", weight: 0 },
      { text: "完全不设防，说都是朋友，开放型", weight: 15 },
      { text: "会介绍给你认识，透明型", weight: -10 }
    ]
  },
  {
    text: "谈到前任时TA的反应？",
    options: [
      { text: "偶尔提及但不带感情，成熟型", weight: 5 },
      { text: "从不主动提及往事，神秘型", weight: -5 },
      { text: "经常拿来做比较，怀旧型", weight: 20 }
    ]
  },
  {
    text: "你生病时TA会？",
    options: [
      { text: "视病情严重程度来照顾，理智型", weight: 0 },
      { text: "生病期间一直陪伴，暖男型", weight: -10 },
      { text: "发个关心但不见面，远程型", weight: 15 }
    ]
  },
  {
    text: "节日或纪念日时TA会？",
    options: [
      { text: "记得日期但礼物随意，随性型", weight: 5 },
      { text: "提前准备惊喜，浪漫型", weight: -10 },
      { text: "经常忘记或找借口，健忘型", weight: 20 }
    ]
  },
  {
    text: "谈到未来规划时TA会？",
    options: [
      { text: "有大致计划但灵活调整，务实型", weight: 0 },
      { text: "说'顺其自然'搪塞过去，随缘型", weight: 15 },
      { text: "认真讨论共同目标，目标型", weight: -10 }
    ]
  },
  {
    text: "TA的社交动态更新？",
    options: [
      { text: "分享工作生活但不涉及感情，低调型", weight: 5 },
      { text: "经常秀恩爱，炫耀型", weight: -5 },
      { text: "营造单身人设，神秘型", weight: 20 }
    ]
  },
  {
    text: "面对异性示好TA会？",
    options: [
      { text: "礼貌拒绝并告知有对象，忠诚型", weight: -10 },
      { text: "默默享受但不回应，享受型", weight: 15 },
      { text: "委婉暗示保持联系，暧昧型", weight: 20 }
    ]
  },
  {
    text: "发现TA说谎后会？",
    options: [
      { text: "承认错误并解释原因，诚实型", weight: -5 },
      { text: "转移话题不承认，狡辩型", weight: 20 },
      { text: "找各种理由开脱，借口型", weight: 15 }
    ]
  },
  {
    text: "TA常说的话是？",
    options: [
      { text: "我这人就是太善良，善良型", weight: 15 },
      { text: "相信我，我不会骗你，信任型", weight: 20 },
      { text: "有什么事我们一起面对，团队型", weight: -10 }
    ]
  }
];

// 结果分级配置
const resultConfig = [
  {
    range: [-100, 30],
    label: "五好男友",
    color: "#66CCFF",
    desc: "放心交往，这是稀有物种！",
    emoji: "👍🏻",
    tips: [
      "珍惜TA的直率性格",
      "多沟通表达真实想法",
      "适当制造小惊喜"
    ],
    suggestion: "要好好珍惜这个真诚的人，记得多给他一些鼓励和温暖 🤗"
  },
  {
    range: [31, 60],
    label: "海王候选人",
    color: "#FF9966",
    desc: "保持警惕，建议暗中观察！",
    emoji: "🐟",
    tips: [
      "留意社交软件使用频率",
      "观察对异性的称呼方式",
      "注意节日是否准时出现"
    ],
    suggestion: "给他一些明确的界限，让他知道你的底线在哪里 ⚠️"
  },
  {
    range: [61, 100],
    label: "灭霸级渣男",
    color: "#FF4500",
    desc: "建议立刻启动复仇者联盟预案！",
    emoji: "👿",
    tips: [
      "检查是否有多个外卖地址",
      "观察手机电量消耗情况",
      "验证社交媒体小号"
    ],
    suggestion: "建议收集证据，该分就分，保护好自己最重要 💪"
  }
];

createApp({
  setup() {
    // 清除所有存储数据（添加这个函数来重置状态）
    const clearAllStorage = () => {
      console.log('清除所有存储数据');
      localStorage.removeItem('currentPage');
      localStorage.removeItem('currentQuestionIndex');
      localStorage.removeItem('answers');
      // 保留boyfriendName不清除
    };
    
    // 在页面加载时清除所有数据
    clearAllStorage();
    
    // 状态管理
    const currentPage = ref('start'); // 强制重置为start页面
    const questions = ref([...questionPool]); // 直接初始化题目列表
    const currentQuestionIndex = ref(0);
    const selectedOption = ref(null);
    const answers = reactive([]);
    const boyfriendName = ref(localStorage.getItem('boyfriendName') || '');

    // 监听状态变化并保存到localStorage
    watch(currentPage, (newVal) => {
      localStorage.setItem('currentPage', newVal);
    });

    watch(currentQuestionIndex, (newVal) => {
      localStorage.setItem('currentQuestionIndex', newVal);
    });

    watch(answers, (newVal) => {
      localStorage.setItem('answers', JSON.stringify(newVal));
    }, { deep: true });

    watch(boyfriendName, (newVal) => {
      localStorage.setItem('boyfriendName', newVal);
    });

    // 初始化测试
    const initTest = () => {
      if (!boyfriendName.value.trim()) {
        alert('请先填写男友称呼哦~');
        return;
      }
      
      // 清除本地存储
      localStorage.removeItem('currentPage');
      localStorage.removeItem('currentQuestionIndex');
      localStorage.removeItem('answers');
      // 保留boyfriendName不清除
      
      // 确保先设置问题列表
      questions.value = [...questionPool];
      // 重置其他状态
      currentQuestionIndex.value = 0;
      selectedOption.value = null;
      answers.length = 0;
      // 最后切换页面
      currentPage.value = 'quiz';
      
      // 打印调试信息
      console.log('初始化测试:', {
        questionsLength: questions.value.length,
        currentQuestion: questions.value[0],
        currentPage: currentPage.value
      });
    };

    // 修改重新测试功能
    const restartTest = () => {
      currentPage.value = 'start';
    };

    // 当前问题
    const currentQuestion = computed(() => {
      const question = questions.value[currentQuestionIndex.value];
      console.log('当前问题:', question);
      return question;
    });

    // 进度条
    const progress = computed(() => 
      ((currentQuestionIndex.value + 1) / questions.value.length) * 100
    );

    // 选择答案
    const selectOption = (option) => {
      selectedOption.value = option;
      answers[currentQuestionIndex.value] = option.weight;
      
      setTimeout(() => {
        if (currentQuestionIndex.value < questions.value.length - 1) {
          currentQuestionIndex.value++;
          selectedOption.value = null;
        } else {
          showResult();
        }
      }, 300);
    };

    // 上一题
    const prevQuestion = () => {
      if (currentQuestionIndex.value > 0) {
        currentQuestionIndex.value--;
        selectedOption.value = answers[currentQuestionIndex.value] ? 
          currentQuestion.value.options.find(
            opt => opt.weight === answers[currentQuestionIndex.value]
          ) : null;
      }
    };

    // 显示结果
    const showResult = () => {
      currentPage.value = 'result';
    };

    // 计算结果
    const score = computed(() => {
      // 计算总分
      const total = answers.reduce((sum, val) => sum + (val || 0), 0);
      // 计算最大可能值（所有题目的最高分）
      const maxPositive = questions.value.length * 20;
      // 计算最小可能值（所有题目的最低分）
      const maxNegative = questions.value.length * -10;
      // 归一化到 0-100 区间
      const normalized = ((total - maxNegative) / (maxPositive - maxNegative)) * 100;
      // 确保结果在 0-100 之间
      return Math.min(Math.max(Math.round(normalized), 0), 100);
    });

    // 结果分级
    const resultData = computed(() => 
      resultConfig.find(r => 
        score.value >= r.range[0] && score.value <= r.range[1]
      )
    );

    const resultLabel = computed(() => resultData.value?.label || '');
    const resultColor = computed(() => resultData.value?.color || '#999');
    const resultDescription = computed(() => resultData.value?.desc || '');
    const resultTips = computed(() => resultData.value?.tips || []);
    const resultSuggestion = computed(() => resultData.value?.suggestion || '');

    // 分享功能
    const shareResult = () => {
      // 创建分享海报
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 800;
      canvas.height = 1600; // 增加画布高度，让内容更加舒展

      // 设置背景
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#fff5f5');
      gradient.addColorStop(1, '#fff0f0');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 添加装饰气泡
      const bubbleGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      bubbleGradient.addColorStop(0, 'rgba(255, 78, 121, 0.02)');
      bubbleGradient.addColorStop(1, 'rgba(255, 153, 102, 0.02)');
      ctx.fillStyle = bubbleGradient;
      
      for(let i = 0; i < 25; i++) { // 增加气泡数量
        ctx.beginPath();
        ctx.arc(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          Math.random() * 80 + 40, // 增加气泡大小
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      // 绘制标题
      const titleGradient = ctx.createLinearGradient(200, 100, 600, 160);
      titleGradient.addColorStop(0, '#ff4e79');
      titleGradient.addColorStop(1, '#ff9966');
      ctx.fillStyle = titleGradient;
      ctx.font = 'bold 80px PingFang SC';
      ctx.textAlign = 'center';
      ctx.fillText('渣男鉴定报告', canvas.width/2, 180);

      // 绘制测试对象
      ctx.fillStyle = '#666';
      ctx.font = '44px PingFang SC';
      ctx.textAlign = 'center';
      ctx.fillText('测试对象：' + boyfriendName.value, canvas.width/2, 260);

      // 绘制表情图标
      ctx.font = '160px sans-serif';
      ctx.fillText(resultData.value.emoji, canvas.width/2, 420);

      // 绘制圆形指数
      const centerX = canvas.width/2;
      const centerY = 620; // 调整圆环位置
      const radius = 170;

      // 绘制外圈光晕
      const glowGradient = ctx.createRadialGradient(
        centerX, centerY, radius - 30,
        centerX, centerY, radius + 30
      );
      glowGradient.addColorStop(0, resultColor.value + '40');
      glowGradient.addColorStop(1, resultColor.value + '00');
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 30, 0, Math.PI * 2);
      ctx.fill();

      // 绘制外圈
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = resultColor.value;
      ctx.lineWidth = 18;
      ctx.stroke();

      // 绘制内圈
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - 25, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();

      // 绘制分数
      const scoreGradient = ctx.createLinearGradient(
        centerX - 100,
        centerY - 60,
        centerX + 100,
        centerY + 60
      );
      scoreGradient.addColorStop(0, '#ff4e79');
      scoreGradient.addColorStop(1, '#ff9966');
      
      ctx.fillStyle = scoreGradient;
      ctx.font = 'bold 140px PingFang SC';
      ctx.textAlign = 'center';
      ctx.fillText(score.value + '%', centerX, centerY + 25);
      
      ctx.fillStyle = '#666';
      ctx.font = '36px PingFang SC';
      ctx.fillText('含渣量', centerX, centerY + 80);

      // 绘制结果标签
      const labelY = 870; // 调整标签位置
      ctx.fillStyle = resultColor.value;
      ctx.font = 'bold 88px PingFang SC';
      ctx.fillText(resultLabel.value, centerX, labelY);

      // 绘制描述
      ctx.fillStyle = '#333';
      ctx.font = '44px PingFang SC';
      ctx.fillText(resultDescription.value, centerX, labelY + 100);

      // 绘制内容框通用样式
      const drawBox = (y, height, title, content, icon) => {
        const boxWidth = canvas.width - 80;
        const boxX = 40;
        
        // 绘制框背景
        const boxGradient = ctx.createLinearGradient(boxX, y, boxX + boxWidth, y + height);
        boxGradient.addColorStop(0, 'rgba(255, 78, 121, 0.03)');
        boxGradient.addColorStop(1, 'rgba(255, 153, 102, 0.03)');
        ctx.fillStyle = boxGradient;
        ctx.fillRect(boxX, y, boxWidth, height);
        
        // 绘制边框
        ctx.strokeStyle = 'rgba(255, 78, 121, 0.1)';
        ctx.lineWidth = 2;
        ctx.strokeRect(boxX, y, boxWidth, height);
        
        // 绘制标题
        ctx.fillStyle = '#ff4e79';
        ctx.font = 'bold 44px PingFang SC';
        ctx.textAlign = 'left';
        ctx.fillText(icon + ' ' + title, boxX + 40, y + 60);
        
        return { boxX, boxWidth };
      };

      // 绘制风险提示
      const tipsY = 1020; // 调整提示框位置
      const { boxX: tipsBoxX } = drawBox(tipsY, 260, '风险提示', resultTips.value, '🚨');
      
      // 绘制提示内容
      ctx.fillStyle = '#444';
      ctx.font = '36px PingFang SC';
      resultTips.value.forEach((tip, index) => {
        ctx.fillText(`• ${tip}`, tipsBoxX + 50, tipsY + 130 + index * 55);
      });

      // 绘制建议
      const suggestionY = tipsY + 320; // 调整建议框位置
      const { boxX: suggestionBoxX, boxWidth: suggestionBoxWidth } = 
        drawBox(suggestionY, 220, '对男友建议', resultSuggestion.value, '💝');
      
      // 绘制建议内容
      ctx.fillStyle = '#444';
      ctx.font = '36px PingFang SC';
      const suggestionText = resultSuggestion.value;
      const maxWidth = suggestionBoxWidth - 100;
      
      // 文本换行处理
      let words = suggestionText.split('');
      let line = '';
      let y = suggestionY + 130;
      
      for (let i = 0; i < words.length; i++) {
        let testLine = line + words[i];
        let metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && i > 0) {
          ctx.fillText(line, suggestionBoxX + 50, y);
          line = words[i];
          y += 55;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, suggestionBoxX + 50, y);

      // 添加间隔，确保底部文字不会重叠
      const footerY = Math.max(y + 130, suggestionY + 350);
      
      // 绘制底部信息
      ctx.fillStyle = '#999';
      ctx.font = '36px PingFang SC';
      ctx.textAlign = 'center';
      ctx.fillText('扫码测测你身边的TA', centerX, footerY);

      // 转换为图片URL并下载
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = '渣男鉴定结果.png';
      link.href = dataUrl;
      link.click();
    };

    return {
      currentPage,
      questions,
      currentQuestionIndex,
      currentQuestion,
      progress,
      selectedOption,
      boyfriendName,
      initTest,
      selectOption,
      prevQuestion,
      score,
      resultLabel,
      resultColor,
      resultDescription,
      resultTips,
      resultSuggestion,
      shareResult,
      restartTest
    };
  }
}).mount('#app');
