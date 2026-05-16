const stateKey = "claudeArchitectTrainer.v1";

const questions = [
  {
    scenario: "Payment Support Agent",
    domain: "Agentic Architecture & Orchestration",
    stem: "A refund assistant sometimes moves from a customer message directly to a refund operation after seeing an email address in the chat. The business requires verified identity before any money movement. Which design change best reduces the risk?",
    support: "問われている本質: お金・権限・本人確認など失敗コストが高い順序は、プロンプトではなく決定的に強制する。",
    options: [
      "Add a guard that prevents refund tools from running until a verified customer ID is present in state.",
      "Add a stronger sentence to the system prompt saying identity checks are required.",
      "Ask the model to explain why it is confident before refunding.",
      "Let the agent retry the refund if the customer later says the account was wrong."
    ],
    answer: 0,
    essence: "Critical workflow ordering needs deterministic enforcement, not only prompt guidance.",
    explanation: "本人確認のような必須手順は、LLMが毎回守ることを期待するだけでは弱いです。前提条件、hook、状態チェックなどで、条件が満たされるまで危険なツールを呼べない設計にします。",
    words: ["verified identity", "money movement", "guard", "deterministic enforcement"]
  },
  {
    scenario: "Agentic Loop Debugging",
    domain: "Agentic Architecture & Orchestration",
    stem: "A developer ends an agent loop whenever the assistant message contains the phrase 'I am done.' In testing, the agent sometimes says that phrase before using all required tools. What should the loop use instead?",
    support: "問われている本質: agentic loopの終了条件は自然文ではなく stop_reason。",
    options: [
      "Continue on stop_reason = tool_use and stop on stop_reason = end_turn.",
      "Stop when the assistant text sounds complete.",
      "Stop after exactly three iterations for predictability.",
      "Stop when the user message contains no question mark."
    ],
    answer: 0,
    essence: "Agent loops should follow structured stop reasons, not natural-language hints.",
    explanation: "tool_useならツール実行結果を会話履歴に戻して次の反復へ進み、end_turnなら最終応答として終了します。自然文の合図や固定回数は見落とし・途中終了の原因になります。",
    words: ["stop_reason", "tool_use", "end_turn", "loop termination"]
  },
  {
    scenario: "Tool Catalog Cleanup",
    domain: "Tool Design & MCP Integration",
    stem: "An agent has search_customer, find_account, and lookup_profile. Their descriptions are one sentence each and all mention 'get user information.' The agent frequently chooses the wrong one. What is the best first improvement?",
    support: "問われている本質: ツール選択の第一情報はツール名と説明。似たツールは境界を書く。",
    options: [
      "Rewrite descriptions with exact purpose, accepted inputs, returned fields, examples, and when not to use each tool.",
      "Hide all tool descriptions so the model relies on tool names only.",
      "Add more tools so the model has finer choices.",
      "Force the model to call all three tools every time."
    ],
    answer: 0,
    essence: "Clear tool descriptions reduce misrouting among similar tools.",
    explanation: "MCPツールは、説明が曖昧だと選び分けが不安定になります。入力形式、境界、例、出力、類似ツールとの差分を具体化するのが最初の高効果な改善です。",
    words: ["tool description", "boundary", "accepted inputs", "misrouting"]
  },
  {
    scenario: "MCP Error Design",
    domain: "Tool Design & MCP Integration",
    stem: "A billing lookup tool returns the same message, 'failed,' for timeouts, invalid IDs, permission problems, and policy denials. The agent keeps retrying cases that can never succeed. What should the tool return?",
    support: "問われている本質: agentが回復判断できるよう、失敗を構造化して返す。",
    options: [
      "Structured error metadata such as category, retryable flag, explanation, and any partial result.",
      "A shorter error string so it uses fewer tokens.",
      "No error, because empty results are easier for the agent to handle.",
      "A stack trace only, because the agent can infer the rest."
    ],
    answer: 0,
    essence: "Structured errors distinguish retryable failures from business or permission failures.",
    explanation: "transientなら再試行、validationなら入力修正、permissionやbusiness errorなら説明・エスカレーションが必要です。isErrorやerrorCategory、isRetryableを使うと無駄な再試行を減らせます。",
    words: ["isError", "errorCategory", "isRetryable", "transient"]
  },
  {
    scenario: "Multi-Agent Research Planning",
    domain: "Agentic Architecture & Orchestration",
    stem: "A research coordinator receives a broad topic, but it assigns every subagent to nearly the same subtopic. Each subagent succeeds, yet the final report has obvious coverage gaps. Where is the main design problem?",
    support: "問われている本質: subagentの実行品質ではなく、coordinatorの分解品質がカバレッジを決める。",
    options: [
      "The coordinator needs broader task decomposition and explicit coverage criteria.",
      "The synthesis agent should invent missing sections to make the report look complete.",
      "Every subagent should receive every possible tool.",
      "The system should remove source metadata to save context."
    ],
    answer: 0,
    essence: "Coordinator decomposition determines whether the whole topic is covered.",
    explanation: "サブエージェントが正しく動いても、渡された範囲が狭ければ出力も狭くなります。coordinatorは要件を分析し、重複を減らしつつ異なる観点へ分担させる必要があります。",
    words: ["coordinator", "task decomposition", "coverage criteria", "subagent"]
  },
  {
    scenario: "Subagent Context Passing",
    domain: "Agentic Architecture & Orchestration",
    stem: "A synthesis subagent is asked to combine findings, but it receives only 'summarize the previous work.' It cannot see the previous agents' conversation history. What should the coordinator do?",
    support: "問われている本質: subagentは親の会話履歴を自動継承しない。必要情報をpromptに明示する。",
    options: [
      "Pass the relevant findings, metadata, source labels, and quality criteria directly in the subagent prompt.",
      "Assume all subagents share memory inside the same session.",
      "Ask the subagent to guess what the prior agents probably found.",
      "Only pass the final report title to keep context small."
    ],
    answer: 0,
    essence: "Subagent context must be explicitly provided.",
    explanation: "subagentは分離された文脈で動く前提です。内容とメタデータを構造化して渡すことで、出典や制約を失わずに合成できます。",
    words: ["isolated context", "explicit context", "metadata", "source labels"]
  },
  {
    scenario: "Claude Code Team Setup",
    domain: "Claude Code Configuration & Workflows",
    stem: "A team wants a shared command that runs their review checklist whenever developers type a slash command. The command should travel with the repository. Where should it be defined?",
    support: "問われている本質: チーム共有はproject-scoped、個人用はuser-scoped。",
    options: [
      "Inside the repository under .claude/commands/.",
      "Only in each developer's home directory.",
      "Inside package.json scripts with no Claude command file.",
      "In a browser bookmark."
    ],
    answer: 0,
    essence: "Shared Claude Code commands should be version-controlled in the project.",
    explanation: "リポジトリ配下の .claude/commands/ はチーム共有に向きます。ホームディレクトリ配下は個人用で、クローンした人へ自動共有されません。",
    words: [".claude/commands", "project-scoped", "version-controlled", "slash command"]
  },
  {
    scenario: "Path-Specific Rules",
    domain: "Claude Code Configuration & Workflows",
    stem: "A repository has API handlers, UI components, and tests scattered across many folders. The team wants test conventions to apply to every matching test file no matter where it lives. Which configuration fits best?",
    support: "問われている本質: ファイルパスに応じた自動適用は glob rules。",
    options: [
      "Use .claude/rules/ with YAML frontmatter paths such as **/*.test.*.",
      "Put all rules in one long paragraph and rely on the model to infer relevance.",
      "Create one directory-level CLAUDE.md only at the repository root.",
      "Ask each developer to remember to paste the test rules manually."
    ],
    answer: 0,
    essence: "Path-scoped rules give deterministic matching for scattered file types.",
    explanation: "テストが複数ディレクトリに散る場合、ディレクトリ単位のCLAUDE.mdだけでは扱いづらいです。globで対象を明示できるrulesが適しています。",
    words: [".claude/rules", "YAML frontmatter", "glob", "path-scoped"]
  },
  {
    scenario: "Planning vs Execution",
    domain: "Claude Code Configuration & Workflows",
    stem: "A requested change touches storage design, API contracts, migration strategy, and dozens of files. There are several valid implementation paths. Which workflow is most appropriate at the start?",
    support: "問われている本質: 影響範囲が広く設計判断があるなら plan mode。",
    options: [
      "Use plan mode to explore constraints and compare approaches before editing.",
      "Use direct execution immediately because planning is only for small fixes.",
      "Randomly choose one path to avoid spending context.",
      "Ask the model to edit every file before reading the codebase."
    ],
    answer: 0,
    essence: "Plan mode is for architectural, multi-file, high-uncertainty work.",
    explanation: "複数の正解があり、依存関係や影響範囲の把握が必要な場合は、先に探索と設計を行うべきです。明確な単一ファイル修正ならdirect executionで十分です。",
    words: ["plan mode", "direct execution", "architectural", "multi-file"]
  },
  {
    scenario: "CI Automation",
    domain: "Claude Code Configuration & Workflows",
    stem: "A CI job calls Claude Code but then waits forever because the command expects an interactive session. What CLI style should be used for automation?",
    support: "問われている本質: CIでは非対話実行。入力待ちを作らない。",
    options: [
      "Run Claude Code in non-interactive print mode, and use structured output flags when machines need to parse the result.",
      "Wait for a human to type into the CI terminal.",
      "Use a browser-only workflow so CI can click buttons.",
      "Disable all output so the job exits immediately."
    ],
    answer: 0,
    essence: "CI needs non-interactive execution and machine-readable output when appropriate.",
    explanation: "自動化では対話待ちがハングになります。非対話モードを使い、PRコメントなどに流す場合はJSON出力やJSON Schemaで構造化します。",
    words: ["non-interactive", "CI", "structured output", "JSON schema"]
  },
  {
    scenario: "Prompt Precision",
    domain: "Prompt Engineering & Structured Output",
    stem: "An automated reviewer reports many style opinions as serious defects. Developers stop trusting the tool. Which prompt change is most likely to improve precision?",
    support: "問われている本質: 'be conservative'より、報告対象と除外対象の具体基準。",
    options: [
      "Define explicit reportable categories, skip categories, and severity examples.",
      "Tell the model to be more careful without changing criteria.",
      "Ask for more findings so at least some are correct.",
      "Remove examples because examples bias the model."
    ],
    answer: 0,
    essence: "Explicit criteria reduce false positives better than vague caution.",
    explanation: "false positiveが多いと信頼が落ちます。バグ・セキュリティ・データ損失など何を報告するか、スタイルや好みは除外するかを具体例つきで定義します。",
    words: ["false positive", "explicit criteria", "severity", "developer trust"]
  },
  {
    scenario: "Few-Shot Extraction",
    domain: "Prompt Engineering & Structured Output",
    stem: "A document extraction prompt handles clean tables well, but fails when the same facts appear in prose, footnotes, or informal units. What should be added before scaling the pipeline?",
    support: "問われている本質: 曖昧・多様な形式にはfew-shotで判断例を見せる。",
    options: [
      "A small set of targeted examples covering the varied formats and expected normalized output.",
      "A request for the model to never make mistakes.",
      "A larger batch size so failures average out.",
      "A rule to return empty JSON whenever the format is unfamiliar."
    ],
    answer: 0,
    essence: "Few-shot examples teach format handling and judgment in ambiguous cases.",
    explanation: "few-shotは単なる形式見本ではなく、似ているが違うケースの判断を示すために使います。大量処理の前に小さなサンプルでプロンプトを固めるのが大事です。",
    words: ["few-shot", "normalization", "ambiguous", "sample set"]
  },
  {
    scenario: "Structured Output",
    domain: "Prompt Engineering & Structured Output",
    stem: "A downstream system rejects free-form JSON because keys are missing or values use unexpected categories. Which approach gives the strongest syntax-level guarantee?",
    support: "問われている本質: 構造化出力はtool_use + JSON Schemaが強い。ただし意味の正しさは別途検証。",
    options: [
      "Use tool use with a JSON schema and appropriate tool_choice.",
      "Ask the model to put JSON inside Markdown code fences.",
      "Tell the model that invalid JSON is not allowed.",
      "Post-process arbitrary prose with regular expressions."
    ],
    answer: 0,
    essence: "Tool use with JSON Schema prevents many syntax and shape failures.",
    explanation: "JSON Schemaはrequired、nullable、enumなどを定義できます。ただし合計金額の一致など意味的な正しさは保証しないため、validationやretryが必要です。",
    words: ["tool_use", "JSON schema", "tool_choice", "semantic validation"]
  },
  {
    scenario: "Validation Retry",
    domain: "Prompt Engineering & Structured Output",
    stem: "An extractor returns a date in the wrong format even though the source contains the date. The validator catches the error. What is the best retry strategy?",
    support: "問われている本質: retryは具体的な検証エラーを返すと効く。情報が存在しない場合は効かない。",
    options: [
      "Send the source, failed extraction, and exact validation error back for correction.",
      "Retry the same prompt with no feedback.",
      "Assume the document has no date and return null.",
      "Increase batch size and ignore validation."
    ],
    answer: 0,
    essence: "Retry with specific error feedback helps correct format or structure errors.",
    explanation: "日付があるのに形式が違うなら、エラー内容を明示して再抽出させます。一方、元文書に存在しない情報はretryしても出てこないので、人間確認やnull扱いが必要です。",
    words: ["validation error", "retry", "failed extraction", "format mismatch"]
  },
  {
    scenario: "Batch Processing",
    domain: "Prompt Engineering & Structured Output",
    stem: "A team has two workloads: a merge gate that developers wait on, and a weekly report that can finish by tomorrow. Which workload is a better fit for batch processing?",
    support: "問われている本質: Batchは安くても待てる処理向け。ブロッキング処理には不向き。",
    options: [
      "The weekly report, because it is latency-tolerant.",
      "The merge gate, because developers can wait indefinitely.",
      "Both workloads, because cost is the only factor.",
      "Neither workload, because batch results cannot be correlated."
    ],
    answer: 0,
    essence: "Batch APIs fit latency-tolerant, non-blocking work.",
    explanation: "batchはコスト面で魅力がありますが、最大処理時間やレイテンシ保証の制約があります。pre-mergeのような待機型フローではリアルタイムAPIが向きます。",
    words: ["batch processing", "latency-tolerant", "blocking", "custom_id"]
  },
  {
    scenario: "Large Review Architecture",
    domain: "Prompt Engineering & Structured Output",
    stem: "A large review over many changed files produces detailed feedback for early files, shallow feedback for middle files, and conflicting judgments across files. What architecture should improve quality?",
    support: "問われている本質: 大きすぎる一括入力はattention dilution。局所パスと統合パスに分ける。",
    options: [
      "Run focused per-file passes, then a separate cross-file integration pass.",
      "Use one even longer prompt asking the model to pay equal attention.",
      "Only review the first and last file.",
      "Require three identical findings before reporting anything."
    ],
    answer: 0,
    essence: "Multi-pass review reduces attention dilution and catches cross-file issues separately.",
    explanation: "大きなレビューは一度に詰め込むほど品質が均一になりません。ファイル単位で局所問題を見て、別パスでデータフローやAPI整合性を見る構成が有効です。",
    words: ["attention dilution", "multi-pass", "per-file", "integration pass"]
  },
  {
    scenario: "Long Conversation State",
    domain: "Context Management & Reliability",
    stem: "A support agent summarizes a long case as 'the customer had an issue with a past purchase.' The amount, date, order ID, and promised deadline disappear from later prompts. What should be preserved?",
    support: "問われている本質: 数値・日付・ID・約束は曖昧な要約に潰さず構造化して保持。",
    options: [
      "A persistent case facts block with exact transactional values and statuses.",
      "Only the emotional tone of the conversation.",
      "A shorter summary with fewer details.",
      "The full raw transcript forever, even when only five fields matter."
    ],
    answer: 0,
    essence: "Critical facts should be extracted into structured state across long interactions.",
    explanation: "progressive summarizationは重要な数値を曖昧にしがちです。金額、日付、注文番号、ステータス、顧客の期待はcase factsとして毎回入れると信頼性が上がります。",
    words: ["case facts", "progressive summarization", "transactional facts", "context"]
  },
  {
    scenario: "Ambiguous Customer Match",
    domain: "Context Management & Reliability",
    stem: "A customer lookup returns three possible accounts with the same name. The agent is tempted to choose the account with the most recent activity. What should it do?",
    support: "問われている本質: 複数候補は推測で選ばず、追加識別子を聞く。",
    options: [
      "Ask for an additional identifier before taking account-specific action.",
      "Choose the most active account because it is statistically likely.",
      "Proceed with all three accounts to save time.",
      "Escalate every duplicate-name case without asking a clarifying question."
    ],
    answer: 0,
    essence: "Ambiguity should be resolved with clarification, not heuristics.",
    explanation: "名前一致だけでは誤対応のリスクがあります。メール、注文番号、電話下4桁などの追加情報を求めるのが正しい曖昧性解消です。",
    words: ["ambiguity", "clarification", "heuristic", "identifier"]
  },
  {
    scenario: "Human Escalation",
    domain: "Context Management & Reliability",
    stem: "A user explicitly says they want a human representative. The request appears easy for the agent to solve. What is the safest response pattern?",
    support: "問われている本質: 明示的な人間希望は尊重する。簡単そうだから無視しない。",
    options: [
      "Escalate or start the handoff process while acknowledging the request.",
      "Ignore the request and solve autonomously because the case is simple.",
      "Ask the user to prove they really need a human.",
      "Use sentiment score to decide whether the request counts."
    ],
    answer: 0,
    essence: "Explicit human requests are escalation triggers.",
    explanation: "ケースの難しさとは別に、顧客が人間対応を明示したこと自体が重要です。状況によっては解決案を提案できますが、人間希望を無視して進めるのは危険です。",
    words: ["human-in-the-loop", "explicit request", "handoff", "escalation trigger"]
  },
  {
    scenario: "Large Codebase Exploration",
    domain: "Context Management & Reliability",
    stem: "During a long codebase investigation, the agent starts referring to 'typical patterns' instead of the actual classes it found earlier. What practice helps preserve reliability?",
    support: "問われている本質: 長時間探索ではscratchpadやsubagentで状態を外に残す。",
    options: [
      "Record key findings in a scratchpad and delegate focused searches to subagents.",
      "Keep all verbose tool output in the main conversation forever.",
      "Avoid writing any notes so the model stays flexible.",
      "Restart from zero every time a new question appears."
    ],
    answer: 0,
    essence: "Structured state persistence protects long investigations from context degradation.",
    explanation: "長い探索では文脈が劣化します。発見したクラス、ファイル、依存関係をscratchpadに残し、詳細探索はsubagentに分けると主会話の見通しを保てます。",
    words: ["scratchpad", "context degradation", "subagent delegation", "state persistence"]
  },
  {
    scenario: "Provenance in Synthesis",
    domain: "Context Management & Reliability",
    stem: "Two credible sources give different statistics for the same metric, from different collection years. What should the synthesis output do?",
    support: "問われている本質: 矛盾は勝手に片方を選ばず、出典と時点つきで扱う。",
    options: [
      "Preserve both values with source attribution and dates, and label the conflict or temporal difference.",
      "Pick the larger number because it looks more recent.",
      "Average the two values and remove source details.",
      "Drop both values to avoid uncertainty."
    ],
    answer: 0,
    essence: "Reliable synthesis preserves provenance and uncertainty.",
    explanation: "multi-source synthesisではclaim-source mappingが重要です。出典、収集日、方法が違えば、矛盾ではなく時点差かもしれません。根拠を残して判断できる形にします。",
    words: ["provenance", "source attribution", "temporal data", "conflict"]
  }
];

const vocab = [
  ["agentic loop", "エージェントがClaudeに依頼し、tool_useならツール実行、end_turnなら終了する反復制御。", "stop_reasonとセットで出やすい。"],
  ["stop_reason", "モデル応答が止まった理由。tool_use と end_turn の見分けが重要。", "終了条件を自然文で判定しない。"],
  ["tool_use", "Claudeがツール呼び出しを要求している状態。", "構造化出力にも使われる。"],
  ["end_turn", "Claudeが最終応答に到達した状態。", "agentic loopの終了条件。"],
  ["coordinator", "複数のsubagentを管理し、分解・委任・集約・再依頼を行う親役。", "狭すぎる分解が典型ミス。"],
  ["subagent", "特定の役割を持つ子エージェント。親の文脈は自動継承しない。", "必要な文脈をpromptで明示する。"],
  ["Task tool", "subagentを起動するためのツール。", "allowedToolsにTaskが必要。"],
  ["allowedTools", "エージェントが使えるツールの制限。", "多すぎるツールは選択精度を下げる。"],
  ["hook", "ツール呼び出しや結果を途中で捕まえて変換・ブロックする仕組み。", "決定的保証が必要な時に強い。"],
  ["PostToolUse", "ツール結果をモデルが読む前に正規化するhookパターン。", "日付形式やステータスコードの統一など。"],
  ["programmatic prerequisite", "前提条件をコード側で強制する仕組み。", "本人確認前の返金禁止など。"],
  ["escalation", "人間担当者へ引き継ぐこと。", "顧客が明示要求、政策ギャップ、進展不能で発生。"],
  ["few-shot", "少数の例で望む判断や形式を示すプロンプト手法。", "曖昧な境界や出力形式に効く。"],
  ["false positive", "問題ではないものを問題として報告する誤検出。", "開発者の信頼を失う。"],
  ["tool_choice", "auto、any、forcedなど、ツール呼び出しの強制度を決める設定。", "構造化出力で頻出。"],
  ["auto", "モデルがツールを呼ぶか自然文で返すか選べる。", "保証は弱い。"],
  ["any", "何らかのツール呼び出しを必ず行わせる。", "複数スキーマから選ぶ時に使う。"],
  ["forced tool selection", "特定のツール名を指定して必ず呼ばせる。", "最初にmetadata抽出を必須にする等。"],
  ["MCP resources", "カタログやスキーマなど、探索前に見える情報を提供する仕組み。", "無駄な探索ツール呼び出しを減らす。"],
  ["isError", "MCPツールの失敗をagentに伝えるフラグ。", "構造化エラーと一緒に覚える。"],
  ["transient error", "タイムアウトや一時的なサービス不調。再試行候補。", "retryableと結びつく。"],
  ["business error", "ポリシー違反など業務ルール上の失敗。", "再試行より説明やエスカレーション。"],
  ["permission error", "権限不足による失敗。", "再試行しても直らないことが多い。"],
  ["CLAUDE.md", "Claude Codeにプロジェクト文脈や規約を渡す設定ファイル。", "user/project/directory階層。"],
  [".claude/rules/", "globパターンでファイル別のルールを自動適用する場所。", "テストが散在する時に強い。"],
  [".claude/commands/", "共有slash commandを置く場所。", "リポジトリ内ならチーム共有。"],
  [".claude/skills/", "Agent Skillを定義する場所。SKILL.md frontmatterを持つ。", "context: forkやallowed-tools。"],
  ["plan mode", "大規模変更や設計判断の前に調査・計画するモード。", "microservices化などで選ぶ。"],
  ["direct execution", "明確で狭い修正をそのまま実行する進め方。", "単一ファイルバグ修正など。"],
  ["--print / -p", "Claude Codeを非対話モードで実行するCLIフラグ。", "CIで入力待ちを防ぐ。"],
  ["JSON schema", "構造化出力の形を定義するスキーマ。", "required、optional、enum、nullable。"],
  ["nullable", "値が存在しない場合にnullを許すこと。", "幻覚で埋めさせない。"],
  ["validation-retry loop", "検証エラーを具体的に返して再抽出させるループ。", "情報欠落には効かない。"],
  ["Message Batches API", "非同期大量処理向けAPI。コスト削減、最大24時間、レイテンシ保証なし。", "pre-mergeには不向き。"],
  ["custom_id", "batchのリクエストとレスポンスを対応づけるID。", "失敗分だけ再投入できる。"],
  ["attention dilution", "大きすぎる入力で注意が薄まり、見落としや矛盾が増えること。", "multi-pass reviewで対策。"],
  ["lost in the middle", "長い入力の中央の情報が抜けやすい現象。", "重要情報は冒頭・末尾や構造化ブロックへ。"],
  ["provenance", "情報の出所・根拠。", "claim-source mappingで守る。"],
  ["claim-source mapping", "主張と出典を対応づける構造。", "要約で出典が消えるのを防ぐ。"],
  ["stratified sampling", "層化サンプリング。文書タイプやフィールド別に精度を見る。", "全体97%に騙されない。"],
  ["deterministic", "毎回同じ条件で確実に実行される性質。", "hooksや前提条件の強み。"],
  ["probabilistic", "モデルの判断により成功率が揺れる性質。", "プロンプト指示だけの弱点。"],
  ["least privilege", "必要最小限の権限やツールだけを渡す原則。", "subagentのtool distributionで頻出。"],
  ["over-provisioning", "必要以上のツールや権限を与えすぎること。", "ツール選択精度を下げる。"],
  ["semantic validation", "JSONの形ではなく、値の意味や整合性を検証すること。", "schemaだけでは防げない。"],
  ["field-level confidence", "フィールドごとの確信度。", "人間レビューの優先順位づけに使う。"],
  ["calibration", "confidenceと実際の正確さを合わせること。", "検証データで閾値を決める。"],
  ["coverage gap", "調査や回答の抜け領域。", "coordinatorとsynthesisの品質確認で重要。"],
  ["handoff", "人間や別システムへの引き継ぎ。", "顧客ID、根本原因、推奨対応を構造化する。"],
  ["MCP scope", "MCPサーバー設定の適用範囲。project-levelとuser-levelがある。", "チーム共有か個人実験かを見分ける。"],
  ["environment variable expansion", ".mcp.jsonなどで環境変数を展開する仕組み。", "秘密情報をリポジトリに入れない。"],
  ["scratchpad", "長い作業で重要発見を外部に残すメモ。", "context degradation対策。"]
].map(([term, meaning, why], index) => ({ id: `v${index}`, term, meaning, why }));

const domains = [
  {
    name: "Agentic Architecture & Orchestration",
    weight: 27,
    focus: "agentic loop、coordinator-subagent、Task tool、hooks、session/fork。",
    test: "自律実行をどこまでモデルに任せ、どこを制御で保証するか。"
  },
  {
    name: "Tool Design & MCP Integration",
    weight: 18,
    focus: "ツール説明、MCP error、tool_choice、project/user scope、resources。",
    test: "LLMが正しくツールを選べる境界設計と、失敗時の回復情報。"
  },
  {
    name: "Claude Code Configuration & Workflows",
    weight: 20,
    focus: "CLAUDE.md、rules、commands、skills、plan mode、CIの-p。",
    test: "個人用とチーム共有、狭い修正と大規模設計の使い分け。"
  },
  {
    name: "Prompt Engineering & Structured Output",
    weight: 20,
    focus: "explicit criteria、few-shot、JSON schema、validation retry、batch、multi-pass review。",
    test: "曖昧な指示を、基準・例・スキーマ・検証で安定させる。"
  },
  {
    name: "Context Management & Reliability",
    weight: 15,
    focus: "case facts、lost in the middle、escalation、scratchpad、confidence calibration、provenance。",
    test: "長い文脈や複数ソースで、重要事実と根拠を落とさない。"
  }
];

const passages = [
  "When deterministic compliance is required, prompt instructions alone have a non-zero failure rate. A programmatic prerequisite should block downstream tool calls until the required verification step has completed.",
  "Subagents operate with isolated context. The coordinator must explicitly provide findings, metadata, source URLs, and quality criteria in the prompt rather than relying on automatic memory sharing.",
  "Tool descriptions are the primary mechanism LLMs use for tool selection. Ambiguous or overlapping descriptions cause misrouting when tools accept similar identifiers or appear to solve similar tasks.",
  "The Message Batches API is appropriate for non-blocking, latency-tolerant workloads such as overnight reports. It is inappropriate for blocking pre-merge checks because there is no guaranteed latency SLA.",
  "Progressive summarization can turn exact transactional facts into vague summaries. Amounts, dates, order numbers, and customer-stated expectations should be preserved in a structured case facts block.",
  "Few-shot examples help the model handle ambiguous cases by demonstrating why one action is preferred over plausible alternatives, not merely by showing the final answer format."
];

const exercises = [
  {
    title: "Multi-tool agent with escalation",
    items: [
      "似た機能のMCPツールを2つ以上作り、説明で境界を明確にする",
      "stop_reasonがtool_useなら続行、end_turnなら終了するループを書く",
      "transient / validation / permission / business errorを構造化して返す",
      "返金上限などをhookまたは前提条件で強制する",
      "複数論点の問い合わせを分解し、最後に統合回答する"
    ]
  },
  {
    title: "Claude Code team workflow",
    items: [
      "project-level CLAUDE.mdに共通規約を書く",
      ".claude/rules/でテストやAPIなどのpath-scoped rulesを作る",
      ".claude/commands/に共有slash commandを作る",
      ".mcp.jsonで環境変数展開を使う",
      "plan modeとdirect executionを3種類のタスクで比較する"
    ]
  },
  {
    title: "Structured extraction pipeline",
    items: [
      "required / optional / nullable / enum / other detailを含むJSON schemaを作る",
      "validation errorを具体的に返すretry loopを作る",
      "フォーマット違いのfew-shotを2-4個加える",
      "batch処理でcustom_idを使い失敗分だけ再投入する",
      "field-level confidenceでhuman reviewへ回す"
    ]
  },
  {
    title: "Multi-agent research pipeline",
    items: [
      "coordinatorがTask toolで複数subagentを起動できるようにする",
      "subagentに必要な文脈をpromptで明示的に渡す",
      "claim、evidence、source、dateを構造化して返す",
      "timeout時にfailure type、attempted query、partial resultsを返す",
      "矛盾する統計を片方に決めず、出典つきで併記する"
    ]
  }
];

let progress = loadProgress();
let activeQuestion = 0;
let questionMode = "english";
let unknownOnly = false;
let readingIndex = 0;
let timerId = null;
let timerLeft = 180;

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(stateKey)) || { questions: {}, vocab: {}, exercises: {}, notes: [] };
  } catch {
    return { questions: {}, vocab: {}, exercises: {}, notes: [] };
  }
}

function saveProgress() {
  localStorage.setItem(stateKey, JSON.stringify(progress));
  updateProgress();
}

function updateProgress() {
  const total = questions.length + vocab.length + exercises.reduce((sum, ex) => sum + ex.items.length, 0);
  const done =
    Object.values(progress.questions).filter(Boolean).length +
    Object.values(progress.vocab).filter(Boolean).length +
    Object.values(progress.exercises).filter(Boolean).length;
  document.getElementById("progressCount").textContent = done;
  document.getElementById("progressTotal").textContent = total;
}

function switchView(id) {
  document.querySelectorAll(".view").forEach((view) => view.classList.toggle("active", view.id === id));
  document.querySelectorAll(".nav-btn").forEach((btn) => btn.classList.toggle("active", btn.dataset.view === id));
}

function renderQuestionList() {
  const list = document.getElementById("questionList");
  list.innerHTML = "";
  questions.forEach((q, index) => {
    const btn = document.createElement("button");
    btn.className = `q-jump ${index === activeQuestion ? "active" : ""} ${progress.questions[index] ? "done" : ""}`;
    btn.textContent = `Q${index + 1} ${q.domain.split(" ")[0]}`;
    btn.addEventListener("click", () => {
      activeQuestion = index;
      renderQuestion();
    });
    list.appendChild(btn);
  });
}

function renderQuestion() {
  const q = questions[activeQuestion];
  document.getElementById("scenarioLine").textContent = `${q.scenario} / ${q.domain}`;
  document.getElementById("questionStem").textContent = q.stem;
  document.getElementById("essenceInput").value = progress.questions[activeQuestion]?.essenceNote || "";
  const supportBox = document.getElementById("supportBox");
  supportBox.textContent = q.support;
  supportBox.classList.toggle("hidden", questionMode !== "support");
  const options = document.getElementById("options");
  options.innerHTML = "";
  q.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.dataset.index = index;
    btn.textContent = `${String.fromCharCode(65 + index)}) ${option}`;
    btn.addEventListener("click", () => {
      document.querySelectorAll(".option-btn").forEach((item) => item.classList.remove("selected"));
      btn.classList.add("selected");
    });
    options.appendChild(btn);
  });
  document.getElementById("answerPanel").classList.add("hidden");
  renderQuestionList();
}

function checkAnswer() {
  const selected = document.querySelector(".option-btn.selected");
  if (!selected) return;
  const q = questions[activeQuestion];
  const selectedIndex = Number(selected.dataset.index);
  document.querySelectorAll(".option-btn").forEach((btn) => {
    const index = Number(btn.dataset.index);
    btn.classList.toggle("correct", index === q.answer);
    btn.classList.toggle("incorrect", index === selectedIndex && index !== q.answer);
  });
  const panel = document.getElementById("answerPanel");
  panel.classList.remove("hidden");
  panel.innerHTML = `
    <h3>${selectedIndex === q.answer ? "正解" : "見直しポイント"}</h3>
    <p><strong>本質:</strong> ${q.essence}</p>
    <p>${q.explanation}</p>
    <p><strong>重要語:</strong> ${q.words.join(", ")}</p>
  `;
  progress.questions[activeQuestion] = {
    correct: selectedIndex === q.answer,
    essenceNote: document.getElementById("essenceInput").value.trim(),
    answeredAt: new Date().toISOString()
  };
  saveProgress();
  renderQuestionList();
}

function renderVocab() {
  const grid = document.getElementById("vocabGrid");
  const query = document.getElementById("vocabSearch").value.trim().toLowerCase();
  grid.innerHTML = "";
  vocab
    .filter((item) => !unknownOnly || !progress.vocab[item.id])
    .filter((item) => !query || `${item.term} ${item.meaning} ${item.why}`.toLowerCase().includes(query))
    .forEach((item) => {
      const card = document.createElement("article");
      card.className = "vocab-card";
      card.innerHTML = `
        <header>
          <h3>${item.term}</h3>
          <span class="tag">${progress.vocab[item.id] ? "習得" : "未習得"}</span>
        </header>
        <p>${item.meaning}</p>
        <p><strong>試験での見方:</strong> ${item.why}</p>
      `;
      const btn = document.createElement("button");
      btn.className = `known-toggle secondary ${progress.vocab[item.id] ? "done" : ""}`;
      btn.textContent = progress.vocab[item.id] ? "未習得に戻す" : "意味を言える";
      btn.addEventListener("click", () => {
        progress.vocab[item.id] = !progress.vocab[item.id];
        saveProgress();
        renderVocab();
      });
      card.appendChild(btn);
      grid.appendChild(card);
    });
}

function renderDomains() {
  const grid = document.getElementById("domainGrid");
  grid.innerHTML = "";
  domains.forEach((domain) => {
    const card = document.createElement("article");
    card.className = "domain-card";
    card.innerHTML = `
      <header>
        <h3>${domain.name}</h3>
        <span class="tag">${domain.weight}%</span>
      </header>
      <div class="bar"><span style="width:${domain.weight * 3}%"></span></div>
      <p><strong>覚えること:</strong> ${domain.focus}</p>
      <p><strong>問われ方:</strong> ${domain.test}</p>
    `;
    grid.appendChild(card);
  });
}

function renderReading() {
  document.getElementById("readingPassage").textContent = passages[readingIndex];
  document.getElementById("timer").textContent = "03:00";
  timerLeft = 180;
}

function startTimer() {
  clearInterval(timerId);
  timerId = setInterval(() => {
    timerLeft -= 1;
    const minutes = String(Math.floor(timerLeft / 60)).padStart(2, "0");
    const seconds = String(timerLeft % 60).padStart(2, "0");
    document.getElementById("timer").textContent = `${minutes}:${seconds}`;
    if (timerLeft <= 0) clearInterval(timerId);
  }, 1000);
}

function saveReading() {
  const unknown = document.getElementById("readingUnknown").value
    .split(",")
    .map((word) => word.trim())
    .filter(Boolean);
  progress.notes.push({
    passage: passages[readingIndex],
    sv: document.getElementById("readingSv").value.trim(),
    decision: document.getElementById("readingDecision").value.trim(),
    unknown,
    savedAt: new Date().toISOString()
  });
  saveProgress();
  document.getElementById("readingSv").value = "";
  document.getElementById("readingDecision").value = "";
  document.getElementById("readingUnknown").value = "";
}

function renderExercises() {
  const list = document.getElementById("exerciseList");
  list.innerHTML = "";
  exercises.forEach((exercise, exIndex) => {
    const card = document.createElement("article");
    card.className = "exercise-card";
    card.innerHTML = `<h3>${exercise.title}</h3><p>ガイドの準備演習を、試験の判断軸に合わせて短く分解しています。</p>`;
    exercise.items.forEach((item, itemIndex) => {
      const id = `e${exIndex}-${itemIndex}`;
      const label = document.createElement("label");
      label.innerHTML = `<input type="checkbox" ${progress.exercises[id] ? "checked" : ""} /> <span>${item}</span>`;
      label.querySelector("input").addEventListener("change", (event) => {
        progress.exercises[id] = event.target.checked;
        saveProgress();
      });
      card.appendChild(label);
    });
    list.appendChild(card);
  });
}

document.querySelectorAll(".nav-btn").forEach((btn) => btn.addEventListener("click", () => switchView(btn.dataset.view)));
document.querySelectorAll(".segment").forEach((btn) => {
  btn.addEventListener("click", () => {
    questionMode = btn.dataset.mode;
    document.querySelectorAll(".segment").forEach((item) => item.classList.toggle("active", item === btn));
    renderQuestion();
  });
});

document.getElementById("checkAnswer").addEventListener("click", checkAnswer);
document.getElementById("nextQuestion").addEventListener("click", () => {
  activeQuestion = (activeQuestion + 1) % questions.length;
  renderQuestion();
});
document.getElementById("vocabSearch").addEventListener("input", renderVocab);
document.getElementById("showUnknownOnly").addEventListener("click", () => {
  unknownOnly = true;
  renderVocab();
});
document.getElementById("resetFilters").addEventListener("click", () => {
  unknownOnly = false;
  document.getElementById("vocabSearch").value = "";
  renderVocab();
});
document.getElementById("newReading").addEventListener("click", () => {
  readingIndex = (readingIndex + 1) % passages.length;
  renderReading();
});
document.getElementById("startTimer").addEventListener("click", startTimer);
document.getElementById("saveReading").addEventListener("click", saveReading);
document.getElementById("startDaily").addEventListener("click", () => switchView("questions"));

renderQuestion();
renderVocab();
renderDomains();
renderReading();
renderExercises();
updateProgress();
