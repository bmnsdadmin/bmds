using BMDS.Web.Services.Data;
using BMDS.Web.Services.ViewModels;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace BMDS.Web.Services.Controllers
{
    public class MembersController : ApiController
    {
        [HttpGet]
        public async Task<IHttpActionResult> Get()
        {
            using (var context = new BMDSDataContext())
            {
                return Ok(await context.Members.ToListAsync());
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> Post([FromBody] MemberViewModel member)
        {
            using (var context = new BMDSDataContext())
            {
                var memberFound = context.Members.FirstOrDefaultAsync(m => m.Id == member.Id);
                if(memberFound != null)
                {
                    return BadRequest("Member with same ID already existed");
                }
                
                var newMember = context.Members.Add(member.ToMember());
                await context.SaveChangesAsync();
                return Ok(new MemberViewModel(newMember));
            }
        }
    }
}
