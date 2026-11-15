// Data-driven notes. See AGENTS.md before adding or editing topics.
window.STUDY_TOPICS = [
  {
    slug: "array-vs-linked-list",
    title: "陣列與鏈結串列",
    category: "線性結構",
    difficulty: "基礎",
    summary: "比較連續記憶體與節點連結的差異，掌握查找、插入、刪除的成本。",
    concepts: [
      { heading: "陣列（Array）", body: "元素通常儲存在連續記憶體，可透過索引 O(1) 存取；若需搬移元素，指定位置插入或刪除為 O(n)。" },
      { heading: "鏈結串列（Linked List）", body: "節點以指標串接，依序尋找第 k 個節點需 O(n)。若已持有正確節點或其前驅的參考，局部插入或刪除可為 O(1)；不包含尋找位置的時間。" },
      { heading: "常見取捨", body: "陣列適合頻繁依索引讀取；鏈結串列適合已知節點位置下的局部修改，但需要額外指標空間。" }
    ],
    examPoints: ["不要將鏈結串列的「搜尋位置」成本誤寫成 O(1)。", "動態陣列尾端新增通常為攤銷 O(1)，單次擴容可能為 O(n)。"],
    quiz: { question: "在單向鏈結串列中，已知要刪除節點的前驅，刪除所需時間為何？", answer: "O(1)，因為可直接調整前驅節點的 next 指標；前提是已知前驅且不另計搜尋成本。" }
  },
  {
    slug: "stack-and-queue",
    title: "堆疊與佇列",
    category: "線性結構",
    difficulty: "基礎",
    summary: "理解 LIFO 與 FIFO 的操作順序，以及常見應用。",
    concepts: [
      { heading: "堆疊（Stack）", body: "遵守後進先出（LIFO）。標準操作為 push、pop、peek；常用在函式呼叫、括號匹配與 DFS。" },
      { heading: "佇列（Queue）", body: "遵守先進先出（FIFO）。標準操作為 enqueue、dequeue、front；常用在 BFS 與工作排程。" },
      { heading: "複雜度", body: "使用合適的鏈結結構或循環陣列實作時，標準入列、出列、入堆疊與出堆疊操作通常為 O(1)。" }
    ],
    examPoints: ["DFS 通常使用 Stack（或遞迴呼叫堆疊）；BFS 使用 Queue。", "用一般陣列實作佇列時，若每次出列都搬移元素，出列可能變成 O(n)。"],
    quiz: { question: "BFS 為什麼通常使用 Queue，而不是 Stack？", answer: "Queue 以 FIFO 保證先探索到的節點優先展開，才能依照距離起點的層次逐層遍歷。" }
  },
  {
    slug: "binary-search-tree",
    title: "二元搜尋樹",
    category: "樹狀結構",
    difficulty: "中等",
    summary: "掌握 BST 的排序性質、走訪順序，以及樹高對效率的影響。",
    concepts: [
      { heading: "核心性質", body: "對每個節點，左子樹鍵值小於該節點、右子樹鍵值大於該節點（假設不允許重複鍵）；此性質必須在整個子樹成立。" },
      { heading: "走訪（Traversal）", body: "對不含重複鍵且遵守上述性質的 BST，Inorder（左→根→右）走訪會得到遞增序列。" },
      { heading: "時間複雜度", body: "搜尋、插入、刪除皆與樹高 h 相關，為 O(h)。平衡時 h = O(log n)；極端歪斜時 h = O(n)。" }
    ],
    examPoints: ["BST 不保證自動平衡；不能一律寫搜尋 O(log n)。", "刪除有兩個子節點的節點時，可用中序前驅或後繼替代並調整連結。"],
    quiz: { question: "若依序插入 1、2、3、4、5 至未平衡 BST，搜尋 5 的時間複雜度是多少？", answer: "O(n)。樹會向右形成鏈狀，樹高與節點數成正比。" }
  },
  {
    slug: "graph-traversal",
    title: "圖形走訪：BFS 與 DFS",
    category: "圖論",
    difficulty: "中等",
    summary: "比較圖形搜尋策略、輔助資料結構與適用情境。",
    concepts: [
      { heading: "BFS", body: "使用佇列，從起點逐層探索。在無權圖中，BFS 可找到以邊數計算的最短路徑。" },
      { heading: "DFS", body: "使用遞迴或明確的堆疊，沿路徑深入後回溯；可用於連通性、拓樸排序與環檢測等問題。" },
      { heading: "時間複雜度", body: "採鄰接串列且每個頂點及邊最多處理常數次時，BFS、DFS 皆為 O(V + E)；鄰接矩陣走訪通常為 O(V²)。" }
    ],
    examPoints: ["一般 DFS 不保證找到無權圖的最短路徑。", "要避免重複走訪，需維護 visited 狀態；有向圖與無向圖的環判斷細節不同。"],
    quiz: { question: "在無權圖中，若要找最少經過幾條邊才能到達終點，通常選哪個演算法？", answer: "BFS，因為它按距離起點的層數依序展開，第一次到達終點時的邊數最少。" }
  }
];
