import { BookOpen, Bot, Globe, Layout, GraduationCap, Send, PiggyBank, FileBarChart } from "lucide-react";

export const NAV_LINKS = [
  { id: "about", label: "Giới thiệu" },
  { id: "experience", label: "Kinh nghiệm" },
  { id: "projects", label: "Dự án" },
  { id: "skills", label: "Kỹ năng" },
];

export const STATS = [
  { value: "STU", label: "ĐH Công Nghệ Sài Gòn (2021-Nay)" },
  { value: "8+", label: "Dự án phát triển & Tích hợp" },
  { value: "GPT-4", label: "Kinh nghiệm tích hợp AI API" },
  { value: "Full-stack", label: "ReactJS, Node.js & .NET" },
];

export const PROJECTS: Array<{
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  aiRole: string;
  process?: string;
  growth?: string;
  techTags: string[];
  status: string;
  link?: string;
}> = [
  {
    icon: Globe,
    title: "Personal OS",
    description: "Ứng dụng web quản lý thời gian tối giản và tối ưu hóa cao dành riêng cho việc theo dõi mục tiêu cá nhân, thiết lập cột mốc học tập/làm việc và gửi nhắc nhở tự động.",
    aiRole: "Lên kế hoạch, thiết kế giao diện tối giản và tối ưu hóa các tiến trình xử lý dưới local.",
    process: "Mình tự phác thảo luồng lịch/mục tiêu cá nhân trước, sau đó trao đổi với Claude Code từng màn hình một — mô tả hành vi mong muốn, nhận code mẫu, tự chạy thử và phản hồi lỗi/điểm chưa hợp lý để chỉnh tiếp.",
    growth: "Học được cách chia nhỏ một app phức tạp thành từng luồng UI, đọc hiểu và tùy biến code React/TypeScript do AI tạo ra thay vì chỉ copy-paste.",
    techTags: ["React", "TypeScript", "Tailwind CSS", "Time Management"],
    status: "Highlight Project (04/2026 - Nay)",
  },
  {
    icon: BookOpen,
    title: "E-Commerce Fashion Website",
    description: "Nền tảng thương mại điện tử thời trang đầy đủ tính năng gồm giao diện người dùng hiện đại, bộ lọc tìm kiếm, giỏ hàng thanh toán và trang quản trị Admin Panel để quản lý kho hàng.",
    aiRole: "Thiết kế và xây dựng hoàn chỉnh RESTful APIs để quản lý sản phẩm, đơn hàng và phân quyền JWT (Admin/User).",
    process: "Đồ án môn học làm cùng nhóm — mình phụ trách backend, tự thiết kế schema MongoDB rồi nhờ AI review lại logic phân quyền JWT trước khi ráp với frontend của nhóm.",
    growth: "Nắm vững kiến trúc RESTful API, cách thiết kế phân quyền Admin/User an toàn, và làm việc nhóm trên cùng một codebase.",
    techTags: ["ReactJS", "Node.js (ExpressJS)", "MongoDB", "Tailwind CSS"],
    status: "School Project (2024)",
  },
  {
    icon: Bot,
    title: "AI-Powered Customer Support Chatbot",
    description: "Hệ thống chatbot thông minh tích hợp trực tiếp vào website để tự động hóa quy trình chăm sóc khách hàng và phản hồi tức thời dựa trên ngữ cảnh.",
    aiRole: "Kết nối và xử lý luồng truyền dữ liệu thời gian thực (data streaming) với OpenAI GPT API (GPT-4/GPT-3.5).",
    process: "Tự tìm hiểu tài liệu OpenAI API, nhờ AI giải thích cơ chế streaming response, rồi tự viết lại và test trực tiếp trên Postman trước khi ráp vào giao diện chat thật.",
    growth: "Hiểu sâu hơn về xử lý dữ liệu thời gian thực (streaming) giữa backend và frontend, và cách gọi API bên thứ ba an toàn.",
    techTags: ["Node.js (ExpressJS)", "ReactJS", "OpenAI API", "MongoDB", "Bootstrap"],
    status: "School Project (2024)",
  },
  {
    icon: Layout,
    title: "Clothes Management Website",
    description: "Ứng dụng quản lý cửa hàng quần áo dựa trên kiến trúc MVC giúp theo dõi chi tiết sản phẩm, quản lý hàng tồn kho và xử lý luồng giỏ hàng.",
    aiRole: "Áp dụng mô hình thiết kế MVC tách biệt Presentation, Business logic và Data layers; thiết kế schema SQL Server.",
    techTags: ["C#", "ASP.NET MVC", "SQL Server", "HTML/CSS", "JavaScript"],
    status: "Academic Project (2023)",
  },
  {
    icon: GraduationCap,
    title: "TuHocTaiChinh.org",
    description: "Nền tảng tự học tài chính miễn phí với 250+ bài học tương tác, cho phép tải mô hình DCF và Data Center Model để thực hành trực tiếp.",
    aiRole: "Dùng AI hỗ trợ thiết kế nội dung bài học, xây dựng luồng học tương tác và tối ưu trải nghiệm tự học — dự án solo-dev.",
    techTags: ["AI Content", "DCF Modeling", "E-Learning", "Solo Dev"],
    status: "Bản thử nghiệm nội bộ",
  },
  {
    icon: Send,
    title: "VN Finance Bot",
    description: "Bot Telegram tổng hợp và phân loại tin tài chính Việt Nam theo thời gian thực. Đã chuyển sang vận hành thực tế, chạy Docker trên AWS EC2, sửa code trực tiếp thay vì qua trung gian.",
    aiRole: "Tích hợp DeepSeek LLM cho pipeline phân loại - dịch - trích xuất thực thể (NER); tự quản lý rủi ro vận hành như cache, flood-control theo nguồn tin, session Telethon.",
    process: "Đây là dự án mình trực tiếp vận hành lâu nhất — không còn qua trung gian, tự sửa code, tự đọc log lỗi thật trên server rồi trao đổi với Claude Code để khắc phục từng sự cố (session Telethon rớt, flood-control theo nguồn tin).",
    growth: "Từ chỗ chỉ biết code trên máy cá nhân, giờ tự tin vận hành Docker + AWS EC2 thực tế, đọc hiểu log production, và quản lý rủi ro vận hành 24/7.",
    techTags: ["Docker", "AWS EC2", "DeepSeek LLM", "Telegram Bot API"],
    status: "Đang vận hành thực tế",
    link: "https://t.me/+zSvESYMAz7AwYzJl",
  },
  {
    icon: PiggyBank,
    title: "Finbud.net",
    description: "Chatbot tài chính cá nhân hỗ trợ tư vấn lập ngân sách và phân bổ chi tiêu.",
    aiRole: "Xây dựng luồng hội thoại AI tư vấn tài chính cá nhân theo ngữ cảnh người dùng.",
    techTags: ["Chatbot", "Personal Finance", "Budgeting"],
    status: "Bản thử nghiệm nội bộ",
  },
  {
    icon: FileBarChart,
    title: "Financial Statement Reader",
    description: "Công cụ nội bộ phân tích báo cáo tài chính doanh nghiệp (đã thử với Apple, Gemadept).",
    aiRole: "Dùng AI đọc và trích xuất số liệu từ báo cáo tài chính, hỗ trợ phân tích nhanh.",
    techTags: ["Financial Analysis", "AI Extraction"],
    status: "Công cụ nội bộ",
  },
];

export const EXPERIENCES = [
  {
    badge: "Dự án học đường",
    period: "07/2024 - Nay",
    title: "Full-stack & AI Developer",
    description: "Phát triển các giải pháp Web từ Thương mại điện tử đến Tích hợp Trí tuệ nhân tạo (AI Chatbot) phục vụ đồ án môn học và nghiên cứu thực tiễn.",
    bullets: [
      "Xây dựng Web bán hàng hoàn chỉnh với React & Express",
      "Phân quyền người dùng & xác thực mã hóa bằng JWT",
      "Tích hợp OpenAI API hỗ trợ Real-time Streaming",
      "Quản lý & lưu trữ lịch sử hội thoại trên MongoDB"
    ],
    className: "md:col-span-2",
  },
  {
    badge: "Học vấn",
    period: "2021 - Nay",
    title: "Sinh viên CNTT năm cuối",
    description: "Đang theo học ngành Công nghệ thông tin tại Trường Đại học Công Nghệ Sài Gòn (STU). Nắm vững kiến thức nền tảng phát triển ứng dụng và giải thuật.",
  },
  {
    badge: "Đồ án .NET",
    period: "2023",
    title: ".NET Developer (Academic Project)",
    description: "Thiết kế và triển khai ứng dụng quản lý cửa hàng quần áo dựa trên cấu trúc ASP.NET MVC, làm việc sâu với cơ sở dữ liệu quan hệ SQL Server và ngôn ngữ C#.",
  },
  {
    badge: "Định vị bản thân",
    period: "Mục tiêu",
    title: "Full-stack Engineer & AI Integrator",
    description: "Kết hợp thế mạnh tư duy phân tích hệ thống logic với sự nhạy bén về sản phẩm và thị trường tài chính. Luôn hướng tới việc ứng dụng công nghệ mới để tối ưu hóa quy trình làm việc và tạo ra sản phẩm chất lượng cao.",
    tags: [
      "Full-stack Web Dev",
      "AI APIs Integration",
      "Analytical Mindset",
      "Systems Thinking"
    ],
    className: "md:col-span-2",
  },
];

export const SKILLS = [
  {
    title: "Back End & Database",
    items: [
      { name: "Node.js (ExpressJS)", level: "Advanced" },
      { name: "ASP.NET MVC / C#", level: "Basic" },
      { name: "MongoDB", level: "Advanced" },
      { name: "SQL Server", level: "Advanced" },
      { name: "RESTful API / JWT", level: "Advanced" },
    ],
  },
  {
    title: "Front End & Language",
    items: [
      { name: "ReactJS / TypeScript", level: "Advanced" },
      { name: "Tailwind CSS / Bootstrap", level: "Advanced" },
      { name: "HTML / CSS / JS", level: "Advanced" },
      { name: "C++", level: "Basic" },
    ],
  },
  {
    title: "Soft Skills & Languages",
    caption: "khả năng bổ trợ",
    items: [
      { name: "Systems Thinking", level: "Advanced" },
      { name: "Critical Thinking", level: "Advanced" },
      { name: "English", level: "Basic" },
      { name: "Japanese", level: "Basic" },
    ],
  },
  {
    title: "AI & Automation",
    caption: "quy trình làm việc AI-augmented",
    items: [
      { name: "Prompt Engineering", level: "Advanced" },
      { name: "AI Agents & Orchestration", level: "Advanced" },
      { name: "Claude Code", level: "Advanced" },
      { name: "Obsidian Skill System (vault-as-brain, MCP)", level: "Advanced" },
      { name: "Hermes Agent (cron / background / deploy)", level: "Advanced" },
      { name: "OpenClaw", level: "Basic" },
    ],
  },
];
