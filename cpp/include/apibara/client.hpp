#pragma once
#include <curl/curl.h>
#include <stdexcept>
#include <string>
namespace apibara {
class Client {
  std::string key_, base_;
  static size_t write(char* data,size_t size,size_t nmemb,void* target) {
    static_cast<std::string*>(target)->append(data,size*nmemb);return size*nmemb;
  }
public:
  explicit Client(std::string key):key_(std::move(key)),base_("https://apibara.tech/api/v1/vehicle-auction"){
    if(key_.empty())throw std::invalid_argument("API key required");
  }
  std::string get(const std::string& path) const {
    if(path.empty() || path[0]!='/' || (path.size()>1 && path[1]=='/'))throw std::invalid_argument("Invalid path");
    CURL* curl=curl_easy_init();if(!curl)throw std::runtime_error("curl init failed");
    std::string body;struct curl_slist* headers=nullptr;
    headers=curl_slist_append(headers,("X-API-Key: "+key_).c_str());
    headers=curl_slist_append(headers,"Accept: application/json");
    curl_easy_setopt(curl,CURLOPT_URL,(base_+path).c_str());
    curl_easy_setopt(curl,CURLOPT_HTTPHEADER,headers);
    curl_easy_setopt(curl,CURLOPT_FOLLOWLOCATION,0L);
    curl_easy_setopt(curl,CURLOPT_TIMEOUT,30L);
    curl_easy_setopt(curl,CURLOPT_WRITEFUNCTION,&write);
    curl_easy_setopt(curl,CURLOPT_WRITEDATA,&body);
    CURLcode status=curl_easy_perform(curl);long code=0;curl_easy_getinfo(curl,CURLINFO_RESPONSE_CODE,&code);
    curl_slist_free_all(headers);curl_easy_cleanup(curl);
    if(status!=CURLE_OK)throw std::runtime_error("Apibara network error");
    if(code<200 || code>=300)throw std::runtime_error("Apibara HTTP "+std::to_string(code)+": "+body);
    return body;
  }
  std::string vehicles() const {return get("/vehicles");}
  std::string changes() const {return get("/changes");}
  std::string usage() const {return get("/usage");}
};
}
