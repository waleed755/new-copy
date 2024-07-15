export const compressFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0, img.width, img.height);
  
          canvas.toBlob((blob) => {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: file.lastModified,
            });
            resolve({
              uid: file.uid,
              name: file.name,
              status: "done",
              url: URL.createObjectURL(compressedFile),
              originFileObj: compressedFile,
            });
          }, file.type, 0.7); // Adjust quality here (0.7 is 70% quality)
        };
      };
    });
  };