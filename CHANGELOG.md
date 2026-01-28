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

### shift4
| Type | Description |
| -- | -- |
| feat | Use `window.open` with named target `paystoreThreeDSAuthWindow` for authentication |
