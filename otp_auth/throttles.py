from rest_framework.throttling import SimpleRateThrottle


class MobileIPRateThrottle(SimpleRateThrottle):
    scope = "otp_mobile_ip"

    def get_cache_key(self, request, view):
        mobile = request.data.get("mobile", "") if hasattr(request, "data") else ""
        ident = self.get_ident(request)
        if not ident:
            return None
        return self.cache_format % {
            "scope": self.scope,
            "ident": f"{ident}:{mobile}",
        }


class SendOTPThrottle(MobileIPRateThrottle):
    scope = "otp_send"


class VerifyOTPThrottle(MobileIPRateThrottle):
    scope = "otp_verify"
