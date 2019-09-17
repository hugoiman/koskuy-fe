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

  e.GET("/auth", func(c echo.Context) error {
    e.Renderer = &Template{ templates: template.Must(template.ParseFiles(
      "views/guest/login.html", "views/guest/head.html", "views/guest/footer.html",
      )),
    }
    return c.Render(http.StatusOK, "login.html", nil)
  })

  // MEMBER
  e.GET("/home", func(c echo.Context) error {
    e.Renderer = &Template{ templates: template.Must(template.ParseFiles(
      "views/member/head.html", "views/member/header.html", "views/member/footer.html",
      "views/member/section-header.html","views/member/nav-header.html",
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

  // Owner
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

  e.GET("/daftar-anak-kos/:id_kos", func(c echo.Context) error {
    e.Renderer = &Template{ templates: template.Must(template.ParseFiles(
      "views/member/head.html", "views/member/owner/header.html", "views/member/footer.html",
      "views/member/owner/section-header.html", "views/member/nav-header.html",
      "views/member/owner/daftar-renter.html",
      )),
    }
    return c.Render(http.StatusOK, "daftar-renter.html", nil)
  })

  fmt.Println("service main started at :9000")
  e.Logger.Fatal(e.Start(":9000"))
}
