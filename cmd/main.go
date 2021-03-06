package main

import (
  "net/http"
  "fmt"
  "html/template"
  "io"

  "github.com/labstack/echo"
  "github.com/labstack/echo/middleware"
  "github.com/gorilla/context"
  "github.com/rs/cors"
)

type Template struct {
  templates *template.Template
}

func (t *Template) Render(w io.Writer, name string, data interface{}, c echo.Context) error {
  // Add global methods if data is a map
	if viewContext, isMap := data.(map[string]interface{}); isMap {
		viewContext["reverse"] = c.Echo().Reverse
	}
  return t.templates.ExecuteTemplate(w, name, data)
}

type M map[string]interface{}

func main() {
  e := echo.New()

  e.Static("/static","../assets")
  e.Static("/node_modules","../node_modules")

  // e.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
  //   Format: "method=${method}, uri=${uri}, status=${status}, error=${error}\n",
  // }))
  e.Use(middleware.Recover())
  e.Use(echo.WrapMiddleware(context.ClearHandler))

  corsMiddleware := cors.New(cors.Options{
    AllowedOrigins: []string{"*"},
    AllowedMethods: []string{"OPTIONS", "GET", "POST", "PUT", "DELETE"},
    AllowedHeaders: []string{"Content-Type", "X-CSRF-Token", "Authorization"},
    AllowCredentials: true,
    // Debug:          true,
  })

  e.Use(echo.WrapMiddleware(corsMiddleware.Handler))

  //  Error404
  echo.NotFoundHandler = func(c echo.Context) error {
    e.Renderer = &Template{ templates: template.Must(template.ParseFiles(
      "views/member/head.html", "views/member/header.html", "views/member/footer.html",
      "views/member/nav-header.html","views/member/error404.html",
      )),
    }
    return c.Render(http.StatusOK, "error404.html", nil)
  }

  // AUTH

  e.GET("/auth", func(c echo.Context) error {
    e.Renderer = &Template{ templates: template.Must(template.ParseFiles(
      "views/guest/login.html", "views/guest/head.html", "views/guest/footer.html",
      )),
    }
    return c.Render(http.StatusOK, "login.html", nil)
  })

  // Registrasi
  e.GET("/registrasi", func(c echo.Context) error {
    e.Renderer = &Template{ templates: template.Must(template.ParseFiles(
      "views/guest/registrasi.html", "views/guest/head.html", "views/guest/footer.html",
      )),
    }
    return c.Render(http.StatusOK, "registrasi.html", nil)
  })

  //  Reset Password
  e.GET("/lupa-password", func(c echo.Context) error {
    e.Renderer = &Template{ templates: template.Must(template.ParseFiles(
      "views/guest/forgot-password.html", "views/guest/head.html", "views/guest/footer.html",
      )),
    }
    return c.Render(http.StatusOK, "forgot-password.html", nil)
  })

  e.GET("/reset-password", func(c echo.Context) error {
    e.Renderer = &Template{ templates: template.Must(template.ParseFiles(
      "views/guest/reset-password.html", "views/guest/head.html", "views/guest/footer.html",
      )),
    }
    return c.Render(http.StatusOK, "reset-password.html", nil)
  })

  // MEMBER
  e.GET("/home", func(c echo.Context) error {
    e.Renderer = &Template{ templates: template.Must(template.ParseFiles(
      "views/member/head.html", "views/member/header.html", "views/member/footer.html",
      "views/member/section-header.html","views/member/nav-header.html",
      // "views/member/notification.html",
      "views/member/home.html",
      )),
    }
    return c.Render(http.StatusOK, "home.html", nil)
  })

  e.GET("/profil/:username", func(c echo.Context) error {
    e.Renderer = &Template{ templates: template.Must(template.ParseFiles(
      "views/member/head.html", "views/member/header.html", "views/member/footer.html",
      "views/member/section-header.html", "views/member/nav-header.html",
      "views/member/profil.html",
      )),
    }
    return c.Render(http.StatusOK, "profil.html", nil)
  })

  e.GET("/favorit", func(c echo.Context) error {
    e.Renderer = &Template{ templates: template.Must(template.ParseFiles(
      "views/member/head.html", "views/member/header.html", "views/member/footer.html",
      "views/member/section-header.html", "views/member/nav-header.html",
      "views/member/favorit.html",
      )),
    }
    return c.Render(http.StatusOK, "favorit.html", nil)
  })

  //  ANAK KOS (VIEW)
  e.GET("/histori-pembayaran", func(c echo.Context) error {
    e.Renderer = &Template{ templates: template.Must(template.ParseFiles(
      "views/member/head.html", "views/member/header.html", "views/member/footer.html",
      "views/member/section-header.html","views/member/nav-header.html",
      "views/member/renter/histori-pembayaran.html",
      )),
    }
    return c.Render(http.StatusOK, "histori-pembayaran.html", nil)
  })

  e.GET("/invoice-pembayaran", func(c echo.Context) error {
    e.Renderer = &Template{ templates: template.Must(template.ParseFiles(
      "views/member/head.html", "views/member/header.html", "views/member/footer.html",
      "views/member/section-header.html","views/member/nav-header.html",
      "views/member/renter/invoice.html",
      )),
    }
    return c.Render(http.StatusOK, "invoice.html", nil)
  })

  // Owner
  //  Form Tambah Iklan Kos
  e.GET("/new-kos", func(c echo.Context) error {
    e.Renderer = &Template{ templates: template.Must(template.ParseFiles(
      "views/member/head.html", "views/member/owner/header.html", "views/member/footer.html",
      "views/member/owner/section-header.html", "views/member/nav-header.html",
      "views/member/owner/new-kos-form0.html", "views/member/owner/new-kos-form1.html",
      "views/member/owner/new-kos-form2.html", "views/member/owner/new-kos-form3.html",
      )),
    }
    return c.Render(http.StatusOK, "new-kos-form0.html", nil)
  })

  e.GET("/mykos", func(c echo.Context) error {
    e.Renderer = &Template{ templates: template.Must(template.ParseFiles(
      "views/member/head.html", "views/member/owner/header.html", "views/member/footer.html",
      "views/member/owner/section-header.html", "views/member/nav-header.html",
      "views/member/owner/mykos-list.html",
      )),
    }
    return c.Render(http.StatusOK, "mykos-list.html", nil)
  })

  e.GET("/dashboard", func(c echo.Context) error {
    e.Renderer = &Template{ templates: template.Must(template.ParseFiles(
      "views/member/head.html", "views/member/owner/header.html", "views/member/footer.html",
      "views/member/owner/section-header.html", "views/member/nav-header.html",
      "views/member/owner/dashboard.html",
      )),
    }
    return c.Render(http.StatusOK, "dashboard.html", nil)
  })

  e.GET("/laporan-pembayaran", func(c echo.Context) error {
    e.Renderer = &Template{ templates: template.Must(template.ParseFiles(
      "views/member/head.html", "views/member/owner/header.html", "views/member/footer.html",
      "views/member/owner/section-header.html", "views/member/nav-header.html",
      "views/member/owner/laporan-pembayaran.html",
      )),
    }
    return c.Render(http.StatusOK, "laporan-pembayaran.html", nil)
  })

  e.GET("/laporan-bulanan", func(c echo.Context) error {
    e.Renderer = &Template{ templates: template.Must(template.ParseFiles(
      "views/member/head.html", "views/member/owner/header.html", "views/member/footer.html",
      "views/member/owner/section-header.html", "views/member/nav-header.html",
      "views/member/owner/laporan-bulanan.html",
      )),
    }
    return c.Render(http.StatusOK, "laporan-bulanan.html", nil)
  })

  e.GET("/pengaturan", func(c echo.Context) error {
    e.Renderer = &Template{ templates: template.Must(template.ParseFiles(
      "views/member/head.html", "views/member/owner/header.html", "views/member/footer.html",
      "views/member/owner/section-header.html", "views/member/nav-header.html",
      "views/member/owner/pengaturan.html",
      )),
    }
    return c.Render(http.StatusOK, "pengaturan.html", nil)
  })

  e.GET("/pembayaran", func(c echo.Context) error {
    e.Renderer = &Template{ templates: template.Must(template.ParseFiles(
      "views/member/head.html", "views/member/owner/header.html", "views/member/footer.html",
      "views/member/owner/section-header.html", "views/member/nav-header.html",
      "views/member/owner/invoice.html",
      )),
    }
    return c.Render(http.StatusOK, "invoice.html", nil)
  })

  e.GET("/pembayaran-baru", func(c echo.Context) error {
    e.Renderer = &Template{ templates: template.Must(template.ParseFiles(
      "views/member/head.html", "views/member/owner/header.html", "views/member/footer.html",
      "views/member/owner/section-header.html", "views/member/nav-header.html",
      "views/member/owner/pembayaran-baru.html",
      )),
    }
    return c.Render(http.StatusOK, "pembayaran-baru.html", nil)
  })

  //  BOOKING
  e.GET("/booking", func(c echo.Context) error {
    e.Renderer = &Template{ templates: template.Must(template.ParseFiles(
      "views/member/head.html", "views/member/owner/header.html", "views/member/footer.html",
      "views/member/owner/section-header.html", "views/member/nav-header.html",
      "views/member/owner/booking.html",
      )),
    }
    return c.Render(http.StatusOK, "booking.html", nil)
  })

  // RENTER
  e.GET("/daftar-anak-kos", func(c echo.Context) error {
    e.Renderer = &Template{ templates: template.Must(template.ParseFiles(
      "views/member/head.html", "views/member/owner/header.html", "views/member/footer.html",
      "views/member/owner/section-header.html", "views/member/nav-header.html",
      "views/member/owner/daftar-renter.html",
      )),
    }
    return c.Render(http.StatusOK, "daftar-renter.html", nil)
  })

  e.GET("/anak-kos/:slug", func(c echo.Context) error {
    e.Renderer = &Template{ templates: template.Must(template.ParseFiles(
      "views/member/head.html", "views/member/owner/header.html", "views/member/footer.html",
      "views/member/owner/section-header.html", "views/member/nav-header.html",
      "views/member/owner/profil-renter.html",
      )),
    }
    return c.Render(http.StatusOK, "profil-renter.html", nil)
  })

  e.GET("/maps", func(c echo.Context) error {
    e.Renderer = &Template{ templates: template.Must(template.ParseFiles(
      "views/member/head.html", "views/member/owner/header.html", "views/member/footer.html",
      "views/member/owner/example-maps.html",
      )),
    }
    return c.Render(http.StatusOK, "example-maps.html", nil)
  })

  fmt.Println("service main started at :9000")
  e.Logger.Fatal(e.Start(":9000"))
}
