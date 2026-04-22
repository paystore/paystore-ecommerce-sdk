# 1.1.0 (2026-04-22)

## Highlights

| Type | Description |
| -- | -- |
| feat | Add support for new acquirers: `ADIQ`, `CIELO`, `GETNET` and `PAGSEGURO`. |
| feat | Add 3DS authentication support for subscriptions using `subscription_identifier`. |
| feat | Add PagSeguro sandbox challenge flow for test environments. |
| fix | Improve validation errors returned through `onInvalid` when the SDK is not initialized, the acquirer is unsupported, or the identifier is invalid. |

## Authentication

| Type | Description |
| -- | -- |
| feat | `authenticate` now accepts either `payment_identifier` or `subscription_identifier`. Provide exactly one of them. |
| feat | Payment and subscription flows use the same callbacks: `onSuccess`, `onFailure` and `onInvalid`. |

## Supported acquirers

| Acquirer | Supported flows |
| -- | -- |
| `ADIQ` | Payment and subscription 3DS with `FRICTIONLESS` and `JAVASCRIPT`. |
| `CIELO` | Payment and subscription 3DS with `FRICTIONLESS` and `JAVASCRIPT`. |
| `GETNET` | Payment and subscription 3DS with `FRICTIONLESS` and `JAVASCRIPT`. |
| `PAGSEGURO` | Payment and subscription 3DS with `FRICTIONLESS`, `JAVASCRIPT` and sandbox mode. |
| `ENTREPAY` | Payment and subscription 3DS with `FRICTIONLESS`, `ACS_FORM_CHALLENGE` and `IFRAME_CHALLENGE`. |
| `REDE` | Payment and subscription 3DS with `FRICTIONLESS` and `ACS_URL_CHALLENGE`. |
| `SHIFT4` | Payment and subscription 3DS with `FRICTIONLESS` and `ACS_URL_CHALLENGE`. |

## PagSeguro sandbox

| Type | Description |
| -- | -- |
| feat | Enable sandbox mode with `three_ds_info.cardinal.sandbox: true`. |
| feat | Use OTP `123456` to approve the simulated challenge. Any other 6-digit code rejects it. |

# 1.0.0 (2026-01-21)

## core

### Init
| Type | Description |
| -- | -- |
| refactor | Update `init` parameters to **snake_case** to match SDK standards:<br>- `api_token`<br>- `base_url`<br>


### Authentication
| Type | Description |
| -- | -- |
| refactor | Update `authenticate` parameters to **snake_case** to match SDK standards: <br> - `acquirer_name` <br> - `payment_identifier` <br> - `three_ds_type` <br> - `three_ds_info` <br> - `acs_url`  <br> - `iframe_url` |

## Providers

### entrepay
| Type | Description |
| -- | -- |
| feat | Use form target with named target `paystoreThreeDSAuthWindow` for authentication |
| fix | Update `IFRAME_CHALLENGE` validation to accept `iframeUrl` or `acsUrl` |

### rede
| Type | Description |
| -- | -- |
| feat | Use `window.open` target with named target `paystoreThreeDSAuthWindow` for authentication |
| refactor | Remove manual polling configuration in favor of global defaults |

### shift4
| Type | Description |
| -- | -- |
| feat | Use `window.open` with named target `paystoreThreeDSAuthWindow` for authentication |
| refactor | Remove manual polling configuration in favor of global defaults |
