use reqwest::Client as HttpClient;
use serde_json::Value;
pub struct Client { key: String, base: String, http: HttpClient }
impl Client {
    pub fn new(key: impl Into<String>) -> Result<Self, String> {
        let key=key.into(); if key.is_empty(){return Err("API key required".into())}
        Ok(Self { key, base:"https://apibara.tech/api/v1/vehicle-auction".into(), http:HttpClient::new() })
    }
    pub async fn get(&self, path: &str, query: &[(&str,&str)]) -> Result<Value,Box<dyn std::error::Error+Send+Sync>> {
        if !path.starts_with('/') || path.starts_with("//") {return Err("invalid path".into());}
        let response=self.http.get(format!("{}{}",self.base,path)).header("X-API-Key",&self.key).query(query).send().await?;
        let status=response.status();let body=response.text().await?;
        if !status.is_success(){return Err(format!("Apibara HTTP {}: {}",status,body).into());}
        Ok(serde_json::from_str(&body)?)
    }
    pub async fn vehicles(&self,query:&[(&str,&str)])->Result<Value,Box<dyn std::error::Error+Send+Sync>>{self.get("/vehicles",query).await}
    pub async fn changes(&self,query:&[(&str,&str)])->Result<Value,Box<dyn std::error::Error+Send+Sync>>{self.get("/changes",query).await}
    pub async fn reserve(&self,id:&str)->Result<Value,Box<dyn std::error::Error+Send+Sync>>{self.get(&format!("/vehicles/{}/reserve",encode_path(id)),&[]).await}
}
fn encode_path(s:&str)->String {
    let mut result=String::new();
    for b in s.bytes() { if b.is_ascii_alphanumeric()||b"-_.~".contains(&b){result.push(b as char)}else{result.push_str(&format!("%{:02X}",b))} }
    result
}
