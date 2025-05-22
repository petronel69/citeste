Descriere proiect  
InfoEducatie

1. Structuri de date folosite pentru înțelegerea website-ului (folosite în continuare cu scris ***italic si bold***)  
     
***Clasa*** {  
   	uuid		id\_clasa
	uuid		created\_by	(legat de ***User.id***)  
	timestamptz	created\_at  
	text		nume  
	text		join\_code  
}

***Elev*** {  
	uuid		id\_elev		(legat de ***User.id***)  
	uuid		id\_clasa	(legat de ***Clasa.id\_clasa***)  
	timestamptz	created\_at  
	text		status  
}

***User*** {  
	uuid	id  
	text	name  
	text	email  
}

2. O scurta descriere a tehnologiilor folosite  
     
   **Next.js**: Framework TypeScript atat pentru frontend cat și pentru backend (bazat pe React)  
   **Supabase**: Folosit pentru stocarea bazei de date a aplicației (bazat pe PostgreSQL)  
   **Cloudflare R2**: Folosit pentru stocarea fișierelor împărtășite prin intermediul platformei (similar cu AWS S3)  
   **Vercel**: Folosit pentru deploymentul aplicației web (similar cu Cloudflare Pages)  
   **Auth.js**: Framework TypeScript pentru autentificarea utilizatorilor și managementul sesiunilor  
   **Google AI Studio (Gemini 2.0 Flash)**: Folosit pentru generarea unor teste tip grila la comanda utilizatorilor, tinand cont de cerintele acestora (clasa, materia, capitolul și dificultatea)  
     
3. Cum funcționează aplicația (pe scurt)  
     
   Odata autentificati (folosind [Auth.js](http://Auth.js)), utilizatorii pot:  
1. Sa creeze o noua ***Clasa***. Odata cu aceasta clasa, in Cloudflare R2 se va creea un nou bucket cu numele egal cu ***Clasa.id\_clasa***. Atat ***Clasa.id\_clasa*** cat si ***Clasa.join\_code*** sunt generate aleatoriu, pe cand ***Clasa.created\_by*** este setat ca fiind egal cu ***User.id*** (al utilizatorului autentificat in sesiunea din care este creata ***Clasa***), iar ***Clasa.nume*** este setat de către utilizator. In continuare, ne vom referi la acest utilizator (care a creat ***Clasa***) ca “Profesor”. Odata ce a fost creata clasa, Profesorul poate sa:  
   1. Incarce fișiere (denumite in continuare “Lecturi”) de tip PDF, cu un nume setat la alegere. Aceste fișiere vor fi disponibile pentru ***Elev***ii care se vor alătura ulterior acestei clase (prin Cloudflare R2)  
   2. Șteargă Lecturi încărcate anterior  
   3. Accepte alăturarea ***Elev***ilor noi în aceasta clasa  
   4. Elimine ***Elev***i din aceasta clasa  
        
2. Sa ceara permisiunea de alaturare la o ***Clasa*** folosind ***Clasa.join\_code*** (***Elev.status*** va avea valoarea “pending”). Odată ce au fost acceptați de către Profesorul clasei (***Elev.status*** va avea valoarea “active”), acestia pot sa:  
   1. Descarce și vizualizeze lecturile încărcate de Profesor  
   2. Paraseasca ***Clasa***  
3. Sa acceseze pagina “Exersează” unde:  
   1. Pot genera, cu ajutorul inteligenței artificiale (Google Gemini), teste în format grila pentru orice capitol al oricărei materii școlare  
   2. Pot rezolva testele generate anterior (alegand cate 1 dintre cele 4 răspunsuri posibile pentru fiecare întrebare generata)  
   3. Iar apoi, pot vedea punctajul obținut, răspunsurile corecte, și explicația și rezolvarea exercițiilor generate  
4. Sa acceseze biblioteca digitala de manuale (administrată de ministerul educatiei prin website-ul extern [manuale.edu.ro](http://manuale.edu.ro))

 

4. Bucăți de cod care nu au fost scrise în totalitate de către membri echipei noastre  
   1. **app/lib/r2.tsx** \- librărie folosită pentru integrarea serviciilor de stocare S3 a Cloudflare R2 (aceasta  a fost modificata de catre membri echipei pentru a permite utilizarea multiplelor *buckets*) \- [cod original (github.com/diwosuwanto)](https://github.com/diwosuwanto/cloudflare-r2-with-nextjs-upload-download-delete/blob/main/src/utils/r2.ts)   
   2. **app/components/FileList.tsx** \- component React folosit pentru afișarea fișierelor dintr-un bucket Cloudflare R2 \- acesta a trecut prin modificări importante pentru a fi adaptat aplicației noastre web \- [cod original (github.com/diwosuwanto)](https://github.com/diwosuwanto/cloudflare-r2-with-nextjs-upload-download-delete/blob/main/src/components/file-manager.tsx)   
   3. **app/components/FileUploader.tsx** \- component React folosit pentru încărcarea fișierelor intr-un bucket Cloudflare R2 \- și acesta a trecut prin modificări importante pentru a fi adaptat aplicației noastre web \- [cod original (github.com/diwosuwanto)](https://github.com/diwosuwanto/cloudflare-r2-with-nextjs-upload-download-delete/blob/main/src/components/file-manager.tsx)   
   4. **app/components/sidebar.tsx** \- component React folosit in layout-ul principal al aplicației web pentru navigarea website-ului \- acesta a fost, de asemenea, adaptat nevoilor noastre \- [cod original (](https://gist.github.com/nimone/9204ed6e9d725c0eef003011c9113698)[gist.github.com/nimone](https://gist.github.com/nimone)[)](https://gist.github.com/nimone/9204ed6e9d725c0eef003011c9113698)

5. Alte resurse terte folosite  
   1. [Lucide Icons](https://lucide.dev/) \- colectie de imagini disponibile in format SVG  
   2. [Tailwind CSS](https://tailwindcss.com/) \- colectie de clase CSS  
   3. Librării oficiale pentru integrare oferite de: Google AI Studio, Amazon AWS, PostgreSQL, React, Next.js