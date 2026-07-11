import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Instagram, Send, Github, Facebook } from "lucide-react"

function Footerdemo() {
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault()
    setSubscribed(true)
    setTimeout(() => setSubscribed(false), 4000)
  }

  return (
    <footer className="relative border-t border-white/10 bg-black/60 backdrop-blur-md text-white transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-white">Stay Connected</h2>
            <p className="mb-6 text-white/60 text-sm">
              Đăng ký nhận thông tin cập nhật mới nhất về các dự án và chia sẻ từ tôi.
            </p>
            {subscribed ? (
              <div className="text-xs text-white/90 bg-white/10 p-3 rounded-xl border border-white/10 text-center animate-in fade-in-0 duration-300">
                Đăng ký thành công! Cảm ơn bạn.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative">
                <Input
                  type="email"
                  required
                  placeholder="Nhập email của bạn"
                  className="pr-12 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-white/20 focus-visible:ring-offset-0"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-1 top-1 h-8 w-8 rounded-full bg-white text-black hover:bg-white/90 hover:scale-105 transition-transform"
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Đăng ký</span>
                </Button>
              </form>
            )}
            <div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-white/5 blur-2xl pointer-events-none" />
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Điều hướng</h3>
            <nav className="space-y-2 text-sm">
              <a href="#about" className="block text-white/70 hover:text-white transition-colors">
                Giới thiệu
              </a>
              <a href="#projects" className="block text-white/70 hover:text-white transition-colors">
                Dự án
              </a>
              <a href="#skills" className="block text-white/70 hover:text-white transition-colors">
                Kỹ năng
              </a>
              <a href="#contact" className="block text-white/70 hover:text-white transition-colors">
                Liên hệ
              </a>
            </nav>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Thông tin liên hệ</h3>
            <address className="space-y-2 text-sm text-white/70 not-italic">
              <p>TP Hồ Chí Minh, Việt Nam</p>
              <p>Email: htrung23112003@gmail.com</p>
            </address>
          </div>
          <div className="relative">
            <h3 className="mb-4 text-lg font-semibold text-white">Theo dõi</h3>
            <div className="flex space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href="https://www.instagram.com/_cuns_2311/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 transition-all"
                    >
                      <Instagram className="h-4 w-4" />
                      <span className="sr-only">Instagram</span>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Theo dõi trên Instagram</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href="https://github.com/CunLucLac-His"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 transition-all"
                    >
                      <Github className="h-4 w-4" />
                      <span className="sr-only">GitHub</span>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Theo dõi trên GitHub</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href="https://facebook.com/tien.trung03"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 transition-all"
                    >
                      <Facebook className="h-4 w-4" />
                      <span className="sr-only">Facebook</span>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Theo dõi trên Facebook</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-center md:flex-row">
          <p className="text-sm text-white/50">
            © {new Date().getFullYear()} Hà Tiến Trung. Mọi quyền được bảo lưu.
          </p>
          <nav className="flex gap-4 text-sm text-white/50">
            <a href="#" className="hover:text-white transition-colors">
              Chính sách bảo mật
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Điều khoản dịch vụ
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export { Footerdemo }
