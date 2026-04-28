from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

# 纯本地测试，不需要任何API Key！
from langchain_core.prompts import ChatPromptTemplate

# 测试代码，不调用任何AI模型
print("✅ LangChain 环境安装成功！")
print("✅ VS Code 配置完全正常！")

# 测试提示词模板
prompt = ChatPromptTemplate.from_messages([
    ("human", "你好呀！")
])

# 格式化输出
formatted = prompt.format_messages()
print("✅ 测试结果：", formatted)
print("\n🎉 恭喜！你的 LangChain 环境已经完美搭建完成！")