Khi thực hiện git commit, luôn dùng format:

<type>(<scope>): <description>

[optional body]

## Các type được dùng

| Type | Khi nào dùng |
|---|---|
| feat | Thêm tính năng mới |
| fix | Sửa bug |
| refactor | Refactor code, không thêm feature/fix bug |
| docs | Thay đổi documentation |
| style | Format code, không ảnh hưởng logic |
| test | Thêm hoặc sửa test |
| chore | Maintenance: cleanup, dependencies, config |

## Scope (bắt buộc)

Scope cho biết phần nào của project bị ảnh hưởng:

| Scope | Phạm vi |
|---|---|
| auth | Authentication/Authorization |
| product | Product management |
| order | Order processing |
| cart | Shopping cart |
| category | Category management |
| user | User management |
| payment | Payment processing |
| ui | User interface |
| api | API endpoints |
| db | Database changes |
| config | Configuration |

## Rules

1. *Type và Scope*: chữ thường, scope bắt buộc phải có
2. *Description*:
   - Viết bằng tiếng việt
   - Ngắn gọn, tối đa 72 ký tự
   - Không viết hoa chữ cái đầu
   - Không dấu chấm cuối câu
   - Dùng động từ nguyên thể (thêm, sửa, cập nhật, xóa)
3. *Body (optional)*: Giải thích WHAT và WHY, mỗi dòng tối đa 72 ký tự

## Ví dụ

### ✅ GOOD:
git commit -m "feat(auth): thêm chức năng đặt lại mật khẩu"

git commit -m "fix(cart): sửa lỗi null pointer trong luồng thanh toán"

git commit -m "refactor(product): đơn giản hóa logic validation"

git commit -m "docs(api): cập nhật tài liệu các endpoint"

git commit -m "style(ui): sửa chiều cao không đồng nhất của product card"

git commit -m "feat(auth): thêm chức năng quên mật khẩu

- thêm luồng đặt lại mật khẩu qua email
- thêm kiểm tra token có thời hạn
- tạo giao diện đặt lại mật khẩu
- cập nhật email service để gửi thông báo"

### ❌ BAD:
```bash
# Thiếu scope
git commit -m "feat: thêm chức năng đặt lại mật khẩu"

# Quá dài
git commit -m "feat(auth): thêm tính năng mới cho phép người dùng đặt lại mật khẩu khi quên"

# Viết hoa chữ cái đầu
git commit -m "feat(auth): Thêm chức năng đặt lại mật khẩu"

# Có dấu chấm cuối
git commit -m "feat(auth): thêm chức năng đặt lại mật khẩu."

# Không rõ ràng
git commit -m "fix(cart): sửa bug"

# Dùng quá khứ
git commit -m "feat(auth): đã thêm chức năng đặt lại mật khẩu"