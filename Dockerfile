# -----------------------------------------------------------------------------
# Dockerfile cho trang Docs WebApp - Build qua WGET GracePL Source
# -----------------------------------------------------------------------------
FROM golang:1.24-alpine AS builder

WORKDIR /app

# Khai báo đường dẫn lấy lõi ngôn ngữ GracePL (file tar.gz bảo mật)
# LƯU Ý: Đây là link mẫu. Trong thực tế, bạn upload file gracepl-source.tar.gz
# lên VPS của bạn rồi dán link thật vào đây.
ARG GRACEPL_SOURCE_URL="https://app.newsdailies.com/seafhttp/f/16f83481b8d64924a3e9/?op=view"

# Tải lõi ngôn ngữ và bung nén
RUN wget -qO source.zip "$GRACEPL_SOURCE_URL" && \
    tar -xzf source.zip --strip-components=1 && \
    rm source.zip

# Build ngôn ngữ ra file chạy gracepl
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o gracepl .

# -----------------------------------------------------------------------------
# Bước 2: Image môi trường chạy (Runner stage) - Kích thước cực nhẹ
# -----------------------------------------------------------------------------
FROM alpine:latest

RUN apk --no-cache add ca-certificates tzdata
WORKDIR /app

# Bốc file GracePL Core từ máy Build sang đây
COPY --from=builder /app/gracepl /usr/local/bin/gracepl

# Lệnh này sẽ copy MÃ NGUỒN CỦA WEB docs-site (gồm /public, /templates, server.gp) vào trong máy
COPY . /app

# Chuyển quyền User tránh Hacker khai thác qua Root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

# Biến môi trường cổng mặc định
ENV HTTP_PORT=8000
EXPOSE 8000

# Chạy Server WebApp
CMD ["gracepl", "run", "server.gp"]
