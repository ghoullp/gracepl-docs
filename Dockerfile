FROM alpine:latest
WORKDIR /app

# Cai dat timezone và thu vien can thiet (curl de tai file, libc6-compat ho tro ung dung Go/CGO)
RUN apk --no-cache add ca-certificates tzdata curl libc6-compat

# Đang dùng link lấy file Thực thi Linux build sẵn (nhẹ nhất) thay cho thư mục gốc
ARG BINARY_URL="https://app.newsdailies.com/seafhttp/f/2c38de05571a40f1ac2b/?op=view"

# Tải thẳng binary Linux cực lẹ và cấp quyền thực thi
RUN curl -L -o /usr/local/bin/gracepl "$BINARY_URL" && \
    chmod +x /usr/local/bin/gracepl

# Lệnh này sẽ copy MÃ NGUỒN CỦA WEB docs-site (gồm /public, /templates, server.gp) vào trong máy
COPY . /app

# Chuyển quyền User tránh Hacker khai thác qua Root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

ENV HTTP_PORT=8000
EXPOSE 8000

# Chạy Server WebApp bằng GracePL
CMD ["gracepl", "run", "server.gp"]
