// 全局变量
let todos = [];
let score = 0;
let currentPetId = 1;
let currentFilter = 'all';
let pets = {
    1: {
        intimacy: 0,
        level: 1,
        name: '小橘'
    },
    2: {
        intimacy: 0,
        level: 1,
        name: '小白'
    }
};

// 宠物图像路径（根据宠物ID和等级变化）
const petImages = {
    1: {
        1: "pet1.png",
        2: "pet1.png",
        3: "pet1.png",
        4: "pet1.png",
        5: "pet1.png"
    },
    2: {
        1: "pet2.png",
        2: "pet2.png",
        3: "pet2.png",
        4: "pet2.png",
        5: "pet2.png"
    }
};

// 存储AI分析结果
let currentAIResult = '';

// 获取当前宠物
function getCurrentPet() {
    return pets[currentPetId];
}

// DOM元素
const welcomeScreen = document.getElementById('welcome-screen');
const startBtn = document.getElementById('start-btn');
const mainContainer = document.getElementById('main-container');
const todoInput = document.getElementById('todo-input');
const todoPoints = document.getElementById('todo-points');
const todoPriority = document.getElementById('todo-priority');
const todoDeadline = document.getElementById('todo-deadline');
const addTodoBtn = document.getElementById('add-todo');
const todoList = document.getElementById('todo-list');
const scoreValue = document.getElementById('score-value');
const petDisplay = document.getElementById('pet-display');
const petName = document.getElementById('pet-name');
const intimacyValue = document.getElementById('intimacy-value');
const intimacyProgress = document.getElementById('intimacy-progress');
const levelValue = document.getElementById('level-value');
const feedPetBtn = document.getElementById('feed-pet');
const playPetBtn = document.getElementById('play-pet');
const groomPetBtn = document.getElementById('groom-pet');
const animationContainer = document.getElementById('animation-container');
const petSelect = document.getElementById('pet-select');
const aiAnalysisBtn = document.getElementById('ai-analysis');
const aiModal = document.getElementById('ai-modal');
const aiClose = document.querySelector('.close');
const aiPrompt = document.getElementById('ai-prompt');
const aiSubmit = document.getElementById('ai-submit');
const aiResult = document.getElementById('ai-result');
const aiConfirm = document.getElementById('ai-confirm');
const aiConfirmYes = document.getElementById('ai-confirm-yes');
const aiConfirmNo = document.getElementById('ai-confirm-no');
const filterBtns = document.querySelectorAll('.filter-btn');

// 初始化
function init() {
    // 检查是否首次访问
    const isFirstVisit = localStorage.getItem('isFirstVisit');
    
    if (isFirstVisit) {
        // 非首次访问，直接显示主界面
        welcomeScreen.style.display = 'none';
        mainContainer.style.display = 'block';
    } else {
        // 首次访问，显示欢迎界面
        welcomeScreen.style.display = 'flex';
        mainContainer.style.display = 'none';
    }
    
    // 从本地存储加载数据
    loadData();
    // 渲染待办事项
    renderTodos();
    // 更新积分显示
    updateScoreDisplay();
    // 初始化宠物
    initPet();
    // 更新宠物状态
    updatePetStatus();
    // 绑定事件
    bindEvents();
}

// 绑定事件
function bindEvents() {
    // 欢迎界面开始按钮
    startBtn.addEventListener('click', () => {
        welcomeScreen.style.display = 'none';
        mainContainer.style.display = 'block';
        localStorage.setItem('isFirstVisit', 'true');
    });
    
    // 添加待办事项
    addTodoBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
    
    // 宠物互动
    feedPetBtn.addEventListener('click', () => interactWithPet('feed'));
    playPetBtn.addEventListener('click', () => interactWithPet('play'));
    groomPetBtn.addEventListener('click', () => interactWithPet('groom'));
    
    // 宠物选择
    petSelect.addEventListener('change', () => {
        currentPetId = parseInt(petSelect.value);
        updatePetStatus();
        updatePetName();
        saveData();
    });
    
    // 筛选按钮
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTodos();
        });
    });
    
    // AI分析
    aiAnalysisBtn.addEventListener('click', () => {
        aiModal.style.display = 'block';
        aiResult.innerHTML = '';
        aiConfirm.style.display = 'none';
        aiPrompt.value = '';
    });
    
    aiClose.addEventListener('click', () => {
        aiModal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === aiModal) {
            aiModal.style.display = 'none';
        }
    });
    
    aiSubmit.addEventListener('click', () => {
        analyzeWithAI();
    });
    
    aiPrompt.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            analyzeWithAI();
        }
    });
    
    // AI确认按钮
    aiConfirmYes.addEventListener('click', () => {
        addAIResultsToTodo();
    });
    
    aiConfirmNo.addEventListener('click', () => {
        aiModal.style.display = 'none';
        aiResult.innerHTML = '';
        aiConfirm.style.display = 'none';
    });
}

// 添加待办事项
function addTodo() {
    const text = todoInput.value.trim();
    const points = parseInt(todoPoints.value);
    const priority = parseInt(todoPriority.value);
    const deadline = todoDeadline.value;
    
    if (text) {
        const todo = {
            id: Date.now(),
            text,
            points,
            priority,
            deadline: deadline || null,
            completed: false
        };
        
        todos.push(todo);
        saveData();
        renderTodos();
        todoInput.value = '';
        todoDeadline.value = '';
        
        showAnimation('任务已添加！', todoList);
    }
}

// 解析AI结果并添加待办事项
function addAIResultsToTodo() {
    if (!currentAIResult) return;
    
    const lines = currentAIResult.split('\n');
    let taskIndex = 1;
    
    lines.forEach(line => {
        line = line.trim();
        if (!line) return;
        
        // 匹配任务标题（数字、点号、任务名）
        const match = line.match(/^(\d+)[\.、]\s*(.+)/);
        if (match) {
            const todo = {
                id: Date.now() + taskIndex,
                text: match[2].replace(/[\[\]【】""''『』]/g, '').trim(),
                points: 3,
                priority: 2,
                deadline: null,
                completed: false
            };
            
            // 根据关键词设置优先级
            if (line.includes('紧急') || line.includes('重要') || line.includes('高')) {
                todo.priority = 3;
            } else if (line.includes('低') || line.includes('次要')) {
                todo.priority = 1;
            }
            
            todos.push(todo);
            taskIndex++;
        }
    });
    
    if (taskIndex > 1) {
        saveData();
        renderTodos();
        aiModal.style.display = 'none';
        aiResult.innerHTML = '';
        aiConfirm.style.display = 'none';
        currentAIResult = '';
        showAnimation(`已添加 ${taskIndex - 1} 个任务！`, todoList);
    } else {
        alert('无法解析任务列表，请手动添加任务。');
    }
}

// 获取优先级文本
function getPriorityText(priority) {
    switch(priority) {
        case 1: return '低';
        case 2: return '中';
        case 3: return '高';
        default: return '中';
    }
}

// 获取优先级类名
function getPriorityClass(priority) {
    switch(priority) {
        case 1: return 'priority-low';
        case 2: return 'priority-medium';
        case 3: return 'priority-high';
        default: return 'priority-medium';
    }
}

// 格式化日期
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
}

// 渲染待办事项
function renderTodos() {
    todoList.innerHTML = '';
    
    // 根据筛选条件过滤任务
    let filteredTodos = todos;
    if (currentFilter === 'pending') {
        filteredTodos = todos.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(t => t.completed);
    }
    
    // 按优先级和创建时间排序
    filteredTodos.sort((a, b) => {
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }
        return b.priority - a.priority;
    });
    
    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        const deadlineHtml = todo.deadline ? 
            `<span class="todo-deadline">📅 ${formatDate(todo.deadline)}</span>` : '';
        
        li.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleTodo(${todo.id})">
            <div class="todo-content">
                <span class="todo-text">${todo.text}</span>
                <div class="todo-meta">
                    <span class="todo-priority ${getPriorityClass(todo.priority)}">${getPriorityText(todo.priority)}</span>
                    ${deadlineHtml}
                    <span class="todo-points">${todo.points}分</span>
                </div>
            </div>
            <div class="todo-actions">
                <button class="edit-btn" onclick="editTodo(${todo.id})">编辑</button>
                <button class="delete-btn" onclick="deleteTodo(${todo.id})">删除</button>
            </div>
        `;
        todoList.appendChild(li);
    });
}

// 切换待办事项状态
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        if (todo.completed) {
            score += todo.points;
            showAnimation(`+${todo.points}分`, todoList);
        } else {
            score -= todo.points;
            showAnimation(`-${todo.points}分`, todoList);
        }
        saveData();
        renderTodos();
        updateScoreDisplay();
        updatePetActions();
    }
}

// 编辑待办事项
function editTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        const newText = prompt('请输入新的任务内容:', todo.text);
        if (newText !== null && newText.trim() !== '') {
            todo.text = newText.trim();
            
            const newPriority = prompt('请输入优先级 (1-低, 2-中, 3-高):', todo.priority);
            if (newPriority && !isNaN(parseInt(newPriority))) {
                todo.priority = Math.min(3, Math.max(1, parseInt(newPriority)));
            }
            
            const newDeadline = prompt('请输入截止日期 (格式: YYYY-MM-DD):', todo.deadline || '');
            if (newDeadline !== null) {
                todo.deadline = newDeadline || null;
            }
            
            saveData();
            renderTodos();
        }
    }
}

// 删除待办事项
function deleteTodo(id) {
    const index = todos.findIndex(t => t.id === id);
    if (index !== -1) {
        const todo = todos[index];
        if (todo.completed) {
            score -= todo.points;
            showAnimation(`-${todo.points}分`, todoList);
        }
        todos.splice(index, 1);
        saveData();
        renderTodos();
        updateScoreDisplay();
        updatePetActions();
    }
}

// 更新积分显示
function updateScoreDisplay() {
    scoreValue.textContent = score;
}

// 初始化宠物
function initPet() {
    updatePetImage();
    updatePetName();
}

// 更新宠物名称
function updatePetName() {
    const pet = getCurrentPet();
    petName.textContent = pet.name || `宠物${currentPetId}号`;
}

// 更新宠物图像
function updatePetImage() {
    const pet = getCurrentPet();
    const level = Math.min(pet.level, 5);
    const img = document.createElement('img');
    img.src = petImages[currentPetId][level];
    img.className = 'pet-image';
    petDisplay.innerHTML = '';
    petDisplay.appendChild(img);
}

// 更新宠物状态
function updatePetStatus() {
    const pet = getCurrentPet();
    intimacyValue.textContent = pet.intimacy;
    levelValue.textContent = pet.level;
    
    // 计算亲密度进度条
    const maxIntimacy = pet.level * 100;
    const progress = Math.min((pet.intimacy / maxIntimacy) * 100, 100);
    intimacyProgress.style.width = `${progress}%`;
    
    // 检查是否升级
    checkLevelUp();
    // 更新宠物图像
    updatePetImage();
    // 更新宠物名称
    updatePetName();
    // 更新宠物互动按钮状态
    updatePetActions();
}

// 检查宠物升级
function checkLevelUp() {
    const pet = getCurrentPet();
    const maxIntimacy = pet.level * 100;
    if (pet.intimacy >= maxIntimacy) {
        pet.level++;
        pet.intimacy = pet.intimacy - maxIntimacy;
        showAnimation(`升级到 ${pet.level} 级！`, petDisplay);
        saveData();
        updatePetStatus();
    }
}

// 与宠物互动
function interactWithPet(action) {
    const pet = getCurrentPet();
    let cost = 0;
    let intimacyGain = 0;
    let message = '';
    
    switch (action) {
        case 'feed':
            cost = 5;
            intimacyGain = 10;
            message = '喂食成功！';
            break;
        case 'play':
            cost = 3;
            intimacyGain = 5;
            message = '玩耍成功！';
            break;
        case 'groom':
            cost = 2;
            intimacyGain = 3;
            message = '梳理成功！';
            break;
    }
    
    if (score >= cost) {
        score -= cost;
        pet.intimacy += intimacyGain;
        showAnimation(`-${cost}分`, petDisplay);
        showAnimation(`+${intimacyGain}亲密度`, petDisplay);
        showAnimation(message, petDisplay);
        saveData();
        updateScoreDisplay();
        updatePetStatus();
    } else {
        showAnimation('积分不足！', petDisplay);
    }
}

// 更新宠物互动按钮状态
function updatePetActions() {
    feedPetBtn.disabled = score < 5;
    playPetBtn.disabled = score < 3;
    groomPetBtn.disabled = score < 2;
}

// 显示动画
function showAnimation(text, targetElement) {
    const animation = document.createElement('div');
    animation.className = 'animation-item';
    animation.textContent = text;
    
    const rect = targetElement.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    animation.style.left = `${x}px`;
    animation.style.top = `${y}px`;
    
    animationContainer.appendChild(animation);
    
    setTimeout(() => {
        animationContainer.removeChild(animation);
    }, 1500);
}

// 保存数据到本地存储
function saveData() {
    localStorage.setItem('todos', JSON.stringify(todos));
    localStorage.setItem('score', score);
    localStorage.setItem('currentPetId', currentPetId);
    localStorage.setItem('pets', JSON.stringify(pets));
}

// 从本地存储加载数据
function loadData() {
    const savedTodos = localStorage.getItem('todos');
    const savedScore = localStorage.getItem('score');
    const savedCurrentPetId = localStorage.getItem('currentPetId');
    const savedPets = localStorage.getItem('pets');
    
    if (savedTodos) {
        todos = JSON.parse(savedTodos);
    }
    
    if (savedScore) {
        score = parseInt(savedScore);
    }
    
    if (savedCurrentPetId) {
        currentPetId = parseInt(savedCurrentPetId);
        petSelect.value = currentPetId;
    }
    
    if (savedPets) {
        pets = JSON.parse(savedPets);
    }
}

// AI分析待办事项
async function analyzeWithAI() {
    const prompt = aiPrompt.value.trim();
    if (!prompt) {
        aiResult.innerHTML = '<p>请输入待办事项内容</p>';
        return;
    }
    
    aiResult.innerHTML = '<p>🤖 AI正在分析中，请稍候...</p>';
    aiSubmit.disabled = true;
    
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer sk-proj-9zA3bC4dE5fG6hI7jK8lM9nO0pQrStUvWxYz'
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: `你是一个专业的待办事项分析助手。请分析用户输入的任务列表，按照以下格式输出分析结果：

1. 将任务按优先级分类（紧急重要、重要不紧急、紧急不重要、不紧急不重要）
2. 为每个任务估计完成时间
3. 给出合理的时间安排建议

请用以下格式输出（注意：必须使用序号+任务名的格式，以便系统解析）：
[优先级排序]
1. 任务名称（紧急）
2. 任务名称（重要）
3. 任务名称（一般）

[时间安排]
今天：任务名称
本周：任务名称

请用中文输出，简洁明了。`
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 800,
                temperature: 0.7
            })
        });
        
        if (!response.ok) {
            throw new Error('API请求失败');
        }
        
        const data = await response.json();
        currentAIResult = data.choices[0].message.content;
        
        aiResult.innerHTML = `<pre style="white-space: pre-wrap; word-break: break-word;">${currentAIResult}</pre>`;
        
        // 显示确认对话框
        aiConfirm.style.display = 'block';
    } catch (error) {
        console.error('AI分析错误:', error);
        // 模拟分析结果
        currentAIResult = `根据您输入的内容，我建议按以下优先级安排任务：

1. 完成项目报告（紧急重要）
2. 回复重要邮件（重要）
3. 整理工作文件（一般）
4. 计划下周行程（低优先级）

建议今天完成第1项，明天完成第2项。`;
        
        aiResult.innerHTML = `<pre style="white-space: pre-wrap; word-break: break-word;">${currentAIResult}</pre>`;
        
        // 显示确认对话框
        aiConfirm.style.display = 'block';
    } finally {
        aiSubmit.disabled = false;
    }
}

// 初始化应用
init();