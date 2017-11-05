using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace BMDS.Web.Services.Controllers
{
    public class InfomationController : ApiController
    {
        // GET: api/Infomation
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Infomation/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Infomation
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/Infomation/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Infomation/5
        public void Delete(int id)
        {
        }
    }
}
