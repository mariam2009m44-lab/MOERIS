(()=> {
const $=id=>document.getElementById(id),cfg=window.MOERIS_FIREBASE_CONFIG||{};
const configured=cfg.apiKey&&!cfg.apiKey.includes("PASTE_")&&cfg.projectId&&!cfg.projectId.includes("YOUR_")&&window.MOERIS_OWNER_UID&&!window.MOERIS_OWNER_UID.includes("PASTE_");
const login=$("loginView"),dash=$("dashboard"),notice=$("setupNotice");
let auth,db,storage,items=[],editingImages=[];
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function status(id,msg){$(id).textContent=msg}
function showLogin(){login.hidden=false;dash.hidden=true;$("logoutBtn").hidden=true}
function showDash(){login.hidden=true;dash.hidden=false;$("logoutBtn").hidden=false}
function initFirebase(){
 if(!configured||!window.firebase){notice.hidden=false;showLogin();status("loginStatus","إعداد Firebase غير مكتمل. راجعي ملف FIREBASE-SETUP.md.");$("loginForm").querySelector("button").disabled=true;return false}
 firebase.initializeApp(cfg);auth=firebase.auth();db=firebase.firestore();storage=firebase.storage();
 auth.onAuthStateChanged(async user=>{
   if(!user){showLogin();return}
   if(user.uid!==window.MOERIS_OWNER_UID){await auth.signOut();showLogin();status("loginStatus","هذا الحساب غير مصرح له بإدارة MOERIS.");return}
   showDash();await loadProducts();
 });return true;
}
$("loginForm").addEventListener("submit",async e=>{
 e.preventDefault();if(!auth)return;const btn=e.submitter;btn.disabled=true;status("loginStatus","جارٍ التحقق من بيانات الدخول…");
 try{await auth.signInWithEmailAndPassword($("email").value.trim(),$("password").value);status("loginStatus","تم تسجيل الدخول.");}
 catch(err){status("loginStatus",err.code==="auth/invalid-credential"?"البريد الإلكتروني أو كلمة المرور غير صحيحة.":"تعذر تسجيل الدخول. تأكدي من تفعيل Email/Password في Firebase.");}
 finally{btn.disabled=false}
});
$("logoutBtn").addEventListener("click",()=>auth?.signOut());
async function loadProducts(){
 status("formStatus","");$("productList").innerHTML='<p class="muted">جارٍ تحميل المنتجات…</p>';
 try{const snap=await db.collection("products").orderBy("updatedAt","desc").get();items=snap.docs.map(d=>({id:d.id,...d.data()}));renderList();}
 catch(err){$("productList").innerHTML='<p class="status">تعذر تحميل المنتجات. تأكدي من نشر Firestore Rules وإنشاء قاعدة البيانات.</p>'}
}
function renderList(){
 $("totalProducts").textContent=items.length;$("activeProducts").textContent=items.filter(p=>p.available!==false).length;
 $("productList").innerHTML=items.length?items.map(p=>'<article class="product-row"><img src="'+esc(p.images?.[0]||"")+'" alt=""><div><b>'+esc(p.name)+'</b><small>'+esc(p.category==="Men"?"رجالي":p.category==="Women"?"نسائي":"يونيسكس")+' · '+Number(p.price||0).toLocaleString("ar-EG")+' ج.م · المخزون '+Number(p.stock||0)+'</small></div><div class="row-actions"><button data-edit="'+esc(p.id)+'">تعديل</button><button class="delete" data-delete="'+esc(p.id)+'">حذف</button></div></article>').join(""):'<p class="muted">لسه مفيش منتجات. ابدئي بإضافة أول ساعة.</p>';
}
function resetForm(){ $("productForm").reset();$("productId").value="";$("stock").value=1;$("available").checked=true;$("formHeading").textContent="إضافة ساعة جديدة";$("saveBtn").innerHTML='حفظ المنتج <span>↙</span>';$("imagePreview").innerHTML="";editingImages=[];status("formStatus","");}
$("resetBtn").addEventListener("click",resetForm);$("refreshBtn").addEventListener("click",loadProducts);
$("photos").addEventListener("change",()=>{
 const files=[...$("photos").files];if(files.length>5){status("formStatus","اختاري 5 صور بحد أقصى.");$("photos").value="";return}
 if(files.some(f=>f.size>5*1024*1024)){status("formStatus","حجم كل صورة لازم يكون أقل من 5MB.");$("photos").value="";return}
 $("imagePreview").innerHTML=files.map(f=>'<img alt="معاينة" src="'+URL.createObjectURL(f)+'">').join("");
});
$("productList").addEventListener("click",async e=>{
 const edit=e.target.closest("[data-edit]");if(edit){const p=items.find(x=>x.id===edit.dataset.edit);if(!p)return;
 $("productId").value=p.id;$("name").value=p.name||"";$("category").value=p.category||"Unisex";$("price").value=p.price||"";$("stock").value=p.stock??0;$("tag").value=p.tag||"";$("description").value=p.description||"";$("case").value=p.case||"";$("movement").value=p.movement||"";$("water").value=p.water||"";$("available").checked=p.available!==false;editingImages=p.images||[];$("imagePreview").innerHTML=editingImages.map(src=>'<img alt="صورة محفوظة" src="'+esc(src)+'">').join("");$("formHeading").textContent="تعديل المنتج";$("saveBtn").textContent="حفظ التعديلات";window.scrollTo({top:0,behavior:"smooth"});return}
 const del=e.target.closest("[data-delete]");if(del){const p=items.find(x=>x.id===del.dataset.delete);if(!p||!confirm("تأكيد حذف "+p.name+" من المتجر؟"))return;try{await db.collection("products").doc(p.id).delete();await loadProducts();status("formStatus","تم حذف المنتج.");}catch(err){status("formStatus","تعذر الحذف. راجعي صلاحيات Firestore.")}}
});
$("productForm").addEventListener("submit",async e=>{
 e.preventDefault();const btn=$("saveBtn"),files=[...$("photos").files];btn.disabled=true;status("formStatus","جارٍ حفظ بيانات المنتج والصور…");
 try{
  const id=$("productId").value||("watch-"+Date.now());const urls=[...editingImages];
  for(let i=0;i<files.length;i++){const file=files[i],safeName=file.name.replace(/[^a-zA-Z0-9._-]/g,"-");const ref=storage.ref("products/"+id+"/"+Date.now()+"-"+i+"-"+safeName);const uploaded=await ref.put(file,{contentType:file.type});urls.push(await uploaded.ref.getDownloadURL())}
  if(!urls.length)throw new Error("ADD_PHOTO");
  const data={name:$("name").value.trim(),category:$("category").value,price:Number($("price").value),stock:Number($("stock").value||0),tag:$("tag").value.trim(),description:$("description").value.trim(),case:$("case").value.trim(),movement:$("movement").value.trim(),water:$("water").value.trim(),images:urls,available:$("available").checked,updatedAt:firebase.firestore.FieldValue.serverTimestamp()};
  if(!$("productId").value)data.createdAt=firebase.firestore.FieldValue.serverTimestamp();
  await db.collection("products").doc(id).set(data,{merge:true});resetForm();await loadProducts();status("formStatus","اتحفظ المنتج بنجاح.");
 }catch(err){status("formStatus",err.message==="ADD_PHOTO"?"ارفعي صورة واحدة على الأقل للمنتج.":"ماقدرناش نحفظ المنتج. تأكدي من إعداد Storage وصلاحياته، وحاولي تاني.");}
 finally{btn.disabled=false}
});
if(!initFirebase())return;
})();