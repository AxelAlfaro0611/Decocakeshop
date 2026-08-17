(function () {
  function initProductImagePreview() {
    var input = document.querySelector("#id_image");
    var preview = document.querySelector("#product-image-preview");
    if (!input || !preview) return;

    input.addEventListener("change", function () {
      var file = this.files && this.files[0];
      if (!file || !file.type.startsWith("image/")) {
        preview.innerHTML = '<span class="preview-empty">Sin imagen</span>';
        return;
      }
      var url = URL.createObjectURL(file);
      preview.innerHTML =
        '<img src="' +
        url +
        '" alt="Vista previa" style="max-height:220px;border-radius:12px;" />';
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initProductImagePreview);
  } else {
    initProductImagePreview();
  }
})();
