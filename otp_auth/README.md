# OTP Auth Module

This app provides OTP-based registration/login with JWT and role-aware onboarding.

## Included features

- Send OTP endpoint
- Verify OTP endpoint with auto register/login
- OTP hashing and expiry
- Resend cooldown
- OTP attempt limit
- Rate limiting hooks
- JWT custom claims (`user_id`, `role`)
- Device token persistence
- Logout token blacklist endpoint
- Audit log for OTP send/verify, register, login
- Partner profile auto-create for role `partner`

## Required project settings

Add to `INSTALLED_APPS`:

- `otp_auth`
- `rest_framework`
- `rest_framework_simplejwt`
- `rest_framework_simplejwt.token_blacklist`

Add/merge in `REST_FRAMEWORK`:

```python
REST_FRAMEWORK = {
    "DEFAULT_THROTTLE_RATES": {
        "otp_send": "5/min",
        "otp_verify": "10/min",
    }
}
```

Optional model labels if your schema uses different app labels:

```python
OTP_AUTH_ROLE_MODEL = "accounts.Role"
OTP_AUTH_PARTNER_PROFILE_MODEL = "partners.PartnerProfile"
OTP_AUTH_DEFAULT_ROLE = "customer"
```

## URL include

```python
path("api/", include("otp_auth.urls"))
```

## Note on partner onboarding

Current implementation creates partner profile with `is_approved=False`.
Document upload and admin approval APIs should be connected to your existing partner module.
